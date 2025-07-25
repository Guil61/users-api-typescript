
## Autenticação de usuários utilizando Node Js e TYpescript!

Este é um projeto CRUD (Create, Read, Update, Delete) de usuários, com autenticação utilizando JWT.

## 🚀 Começando

Siga estas instruções para ter o projeto rodando na sua máquina local:

### 📋 Pré-requisitos

-   **Node:** Certifique-se de ter o node instalado na sua máquina


### 🔧 Instalação

1.  **Clone o Repositório:**
    
    Bash
    
    ```
    git clone https://github.com/Guil61/users-api-typescript
    
    ```
    
2.  **Acesse a Pasta do Projeto e instale as dependências:**
    
    Bash
    
    ```
    npm install

    
    ```

2.  **Abra o arquivo .env e configure as portas do seu banco e a que deseja iniciar o servidor:**
    
    <img width="303" height="138" alt="Captura de tela de 2025-07-16 11-17-20" src="https://github.com/user-attachments/assets/34d3a180-ced7-4f05-bf29-2c9b814a323e" />



3.  **Suba os containers:**
    
    Bash
    
    ```

    docker-compose up -d


    ```    

### 🔧 Endpoints para testes

### POST /auth/register

**Descrição:** Registra um usuário.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/auth/register

```
JSON

```
{
    "nome": "Admin",
    "email": "admin@admin.com",
    "senha": "Abc@1234a5"
}
```

**Exemplo de Resposta:**

JSON

```
{
    "msg": "Usuário criado!"
}

```


### POST /auth/login

**Descrição:** Autentica um usuário e retorna um token.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/auth/login

```
JSON

```
{
    "email": "admin@admin.com",
    "senha": "Abc@1234a5"
}
```

**Exemplo de Resposta:**

JSON

```
{
    "email": "admin@admin.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUzNDUwNTcwLCJleHAiOjE3NTM1MzY5NzB9.sE4Mp8mQJyEDt1PrbTl_o8nuVegHL-CXBfQcAG86Ppw",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzUzNDUwNTcwLCJleHAiOjE3NTQwNTUzNzB9.mE_UxtUSD_-ZI-DjEpdfYPmnhIVfhjQLW0c7yL8LhDE"
}

```

### POST /auth/refresh

**Descrição:** Refresh token de usuário.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/auth/refresh

```



**Exemplo de Resposta:**

JSON

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzUzNDUxNzg2LCJleHAiOjE3NTM0NTUzODZ9.dQBPHEYQMcLFy4rm-QpxPMU2L_-ObRztbQvphwBJQlA",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzUzNDUxNzg2LCJleHAiOjE3NTQwNTY1ODZ9.tisi_GKIrx93AQx2SioelDfEqE3QKFTyymfO7RUI8nQ"
}

```

### POST /auth/password-recovery

**Descrição:** Envia um email para a recuperação de senha do usuário.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/auth/password-recovery

```

JSON

```
{
    "userMail": "admin@admin.com",
}
```


**Exemplo de Resposta:**

JSON

```
{
    "msg": "Um email com o token para recuperação foi enviado para o email admin@admin.com"
}

```

![alt text](<Captura de tela de 2025-07-25 10-57-35.png>)

### PUT /auth/change-password

**Descrição:** Atualiza a senha do usuário com o token enviado no email.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/auth/change-password
```

JSON

```
{
  "email": "admin@admin.com",
  "newPassword": "Senha@123"
}

```


**Exemplo de Resposta:**

JSON

```
{
    "msg": "Senha atualizada!"
}

```




### 🔒 A partir daqui, utilize o token de autenticação na autorização para fazer as requisições!

### GET /users/{id}

**Descrição:** Retorna um usuário específico pelo ID.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/users/2

```


**Exemplo de Resposta:**

JSON

```
[{
    "id": 20,
    "nome": "João SIlva",
    "email": "teste1@teste.com",
    "createdAt": "2025-07-15T16:32:51.715Z",
    "updatedAt": "2025-07-15T16:32:51.715Z"
}](http://localhost:8080/users/20)
```


### DELETE /users/{id}

**Descrição:** Exclui um usuáio pelo id.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/users/20

```


**Exemplo de Resposta:**

JSON

```
{
    "msg": "Objeto deletado",
    "result": 1
}

```


### GET /users/

**Descrição:** Retorna uma lista com todos os usuários.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/users/
```




**Exemplo de Resposta:**

JSON

```
[
    {
        "id": 1,
        "nome": "José DIas",
        "email": "josedias@email.com",
        "createdAt": "2025-07-15T13:52:39.688Z",
        "updatedAt": "2025-07-15T13:52:39.688Z"
    },
    {
        "id": 2,
        "nome": "John DOe",
        "email": "johndoe@email.com",
        "createdAt": "2025-07-15T14:19:48.489Z",
        "updatedAt": "2025-07-15T14:19:48.489Z"
    },
    {
        "id": 3,
        "nome": "Fahul Sadik",
        "email": "fahul@email.com",
        "createdAt": "2025-07-15T14:47:49.614Z",
        "updatedAt": "2025-07-15T14:47:49.614Z"
    }
]


```

### GET /products/{id}

**Descrição:** Retorna um produto específico pelo ID.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/products/2

```


**Exemplo de Resposta:**

JSON

```
{
    "id": 1,
    "name": "Fone de ouvido",
    "code": "123456789",
    "description": "Fone de ouvido bluetooth",
    "userId": 2
}
```


### POST /products/new

**Descrição:** Cria um novo produto.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/products/new

```

JSON

```
{
    "name": "Teclado mecânico razer",
    "code": "899009090",
    "description": "Teclado mecanico razer switch red"
}
```


**Exemplo de Resposta:**

JSON

```
{
    "msg": "Produto criado!",
    "result": {
        "id": 7,
        "name": "Teclado mecânico razer",
        "code": "899009090",
        "description": "Teclado mecanico razer switch red",
        "userId": 1
    }
}

```

### PUT /products/{id}

**Descrição:** Atualiza um produto.

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/products/7

```

JSON

```
{
    "name": "Teclado mecânico razer atualizado",
    "code": "N0V0 C0D1G0",
    "description": "Teclado mecanico foi atualizado"
}
```


**Exemplo de Resposta:**

JSON

```
{
    "msg": "Produto atualizado!",
    "result": {
        "id": 7,
        "name": "Teclado mecânico razer atualizado",
        "code": "N0V0 C0D1G0",
        "description": "Teclado mecanico foi atualizado",
        "userId": 2
    }
}

```


### GET /products/

**Descrição:** Lista todos os produtos

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/products/

```


**Exemplo de Resposta:**

JSON

```
[
    {
        "id": 1,
        "name": "Fone de ouvido bom",
        "description": "Fone de ouvido",
        "code": "123456789",
        "userId": 2,
        "createdAt": "2025-07-24T18:42:35.362Z",
        "updatedAt": "2025-07-24T18:42:35.362Z",
        "deletedAt": null
    },
    {
        "id": 5,
        "name": "Teclado mecânico redragon",
        "description": "Teclado mecanico redragon switch brown",
        "code": "190876555",
        "userId": 1,
        "createdAt": "2025-07-24T18:46:04.517Z",
        "updatedAt": "2025-07-24T18:46:04.517Z",
        "deletedAt": null
    },
    {
        "id": 6,
        "name": "Teclado mecânico razer",
        "description": "Teclado mecanico razer switch red",
        "code": "899009090",
        "userId": 1,
        "createdAt": "2025-07-24T18:46:23.038Z",
        "updatedAt": "2025-07-24T18:46:23.038Z",
        "deletedAt": null
    }
]

```

### DELETE /products/{id}

**Descrição:** Deleta um produto pelo id

**Exemplo de Requisição:**

Bash

```
http://localhost:8080/products/1

```


**Exemplo de Resposta:**

JSON

```
{
    "msg": "Produto deletado!",
}


```




## 🛠️ Construído com

-   **NodeJs**
-   **Postgres**
-   **TypeScript** 
-   **Express** 

----------

 Feito por [Andre Guil](https://github.com/Guil61) 
