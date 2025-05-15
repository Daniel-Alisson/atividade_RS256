# Atividade: Mudança de Algoritmo JWT de HS256 para RS256

## Requisitos

* Node.js instalado
* OpenSSL instalado

### Instalando o OpenSSL

No Windows, você pode baixar o OpenSSL através do link oficial:

* [OpenSSL para Windows](https://openssl-library.org/source/)

---

## Gerando as Chaves (RS256)

O algoritmo RS256 utiliza um par de chaves: **pública** e **privada**.

1. Abra o terminal (ou o prompt de comando no Windows).

2. Gere a chave privada:

   ```bash
   openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
   ```

   * A chave privada será salva no arquivo **private.key**.

3. Gere a chave pública com base na chave privada:

   ```bash
   openssl rsa -pubout -in private.key -out public.key
   ```

   * A chave pública será salva no arquivo **public.key**.
4. Adicione as chaves na pasta 'routes'.
