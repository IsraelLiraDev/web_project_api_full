# Implantação no Google Cloud

Passo a passo para colocar o projeto no ar. Troque `SEU-DOMINIO` pelo seu domínio (por exemplo, um do FreeDNS) e `SEU-USUARIO` pelo usuário da VM.

## 1. Criar a VM

1. No Google Cloud Console, crie uma instância do Compute Engine com Ubuntu LTS e habilite **HTTP** e **HTTPS** no firewall.
2. Reserve um **IP externo estático** para a instância.
3. Aponte o domínio para esse IP com dois registros `A`: `SEU-DOMINIO` e `api.SEU-DOMINIO`.

## 2. Instalar o que o servidor precisa

```bash
sudo apt update && sudo apt install -y nginx git
# Node.js (versão LTS): siga as instruções em https://nodejs.org
sudo npm install -g pm2
```

**MongoDB:** a opção mais simples é um cluster gratuito no MongoDB Atlas. Crie o cluster, libere o IP da VM, crie um usuário e copie a string de conexão para o `MONGO_URI` do `.env` (passo 4). Também dá para instalar o MongoDB na própria VM seguindo a documentação oficial.

## 3. Enviar o código

```bash
# No seu computador: gere o front apontando para a API em produção
cd frontend
npm install
VITE_API_URL=https://api.SEU-DOMINIO npm run build   # gera a pasta dist/

# Copie o conteúdo de dist/ para a pasta frontend/ do servidor
ssh SEU-USUARIO@IP_DA_VM "mkdir -p ~/web_project_api_full/frontend"
scp -r dist/* SEU-USUARIO@IP_DA_VM:~/web_project_api_full/frontend/
```

No servidor, traga só o back-end do repositório e instale as dependências:

```bash
git clone https://github.com/SEU-USUARIO-GITHUB/web_project_api_full.git ~/repo-tmp
mv ~/repo-tmp/backend ~/web_project_api_full/backend && rm -rf ~/repo-tmp
cd ~/web_project_api_full/backend && npm install --omit=dev
```

## 4. Criar o `.env` (somente no servidor)

```bash
cd ~/web_project_api_full/backend
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"   # copie o resultado
nano .env
```

```
NODE_ENV=production
JWT_SECRET=<cole o segredo gerado>
PORT=3001
MONGO_URI=<string de conexão do MongoDB>
```

## 5. Rodar a API com o PM2

```bash
cd ~/web_project_api_full/backend
pm2 start app.js --name around-api
pm2 save
pm2 startup     # execute o comando que ele imprimir, para iniciar no boot
```

## 6. Configurar o Nginx

Crie `/etc/nginx/sites-available/around` (ajuste o `root` com o seu usuário):

```nginx
server {
    listen 80;
    server_name SEU-DOMINIO www.SEU-DOMINIO;

    root /home/SEU-USUARIO/web_project_api_full/frontend;
    index index.html;

    location / {
        # necessário para o React Router: rotas como /signin devem cair no index.html
        try_files $uri /index.html;
    }
}

server {
    listen 80;
    server_name api.SEU-DOMINIO;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/around /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Se o Nginx não conseguir ler os arquivos, confira as permissões da pasta pessoal (`chmod o+x /home/SEU-USUARIO`).

## 7. HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d SEU-DOMINIO -d www.SEU-DOMINIO -d api.SEU-DOMINIO
```

Confira o certificado em https://www.sslshopper.com/ssl-checker.html.

## 8. Testar

- `https://SEU-DOMINIO` abre o front e as rotas `/signin` e `/signup` funcionam ao recarregar a página.
- Cadastro, login, edição de perfil, adição e remoção de cartões e curtidas funcionam.
- `https://api.SEU-DOMINIO/crash-test` derruba o processo e o PM2 o reinicia sozinho (`pm2 status` mostra o contador de reinícios). Depois da revisão, **remova a rota `/crash-test`** do `backend/app.js`.
- Os arquivos `request.log` e `error.log` aparecem na pasta `backend/` do servidor e não são versionados.
