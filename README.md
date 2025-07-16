
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
    
    Bash
    
    ```
    <img width="303" height="138" alt="Captura de tela de 2025-07-16 11-17-20" src="https://github.com/user-attachments/assets/3b8a51f3-3ae8-42eb-86a2-820906e364c6" />

    ```


3.  **Inicie o servidor:**
    
    Bash
    
    ```
    npm run dev

    ou

    npm start

    ```    

### 🔧 Endpoints para testes

### POST /auth/registe

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImlhdCI6MTc1MjY3NTk4MiwiZXhwIjoxNzUyNzYyMzgyfQ.Ql7xHLBqvwmkuZKPSouuuRfQY2Lb0TZxyktAAC2Z1pk"
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


```


### DELETE /contratos/{id}

**Descrição:** Exclui um contrato pelo ID.

**Exemplo de Requisição:**

Bash

```
DELETE http://localhost:8080/contratos/3

```


**Exemplo de Resposta:**

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




## 🛠️ Construído com

-   **NodeJs**
-   **Postgres**
-   **TypeScript** 
-   **Express** 

----------

 Feito com ❤️ por [André Guil](https://github.com/Guil61) 
