# Proyecto Backend 3

Este es un proyecto Backend donde se implementan herramientas de testing y logger.

El repositorio del proyecto original es:  
[https://github.com/CoderContenidos/RecursosBackend-Adoptme](https://github.com/CoderContenidos/RecursosBackend-Adoptme)

## Pasos para clonar y testear el código

1. Clonar el repositorio en tu máquina local con el siguiente comando:

   ```bash
   git clone https://github.com/NicolasSMoralesRomero/entrega-backend-3
   ```

2. Instalar las dependencias con el siguiente comando:
```bash
npm install
```

3. Configurar las credenciales en el archivo .env, utilizando los datos proporcionados en la entrega.

4. Para levantar el servidor, ejecuta el siguiente comando:

```bash
npm start
```

5. Ingresa a la siguiente URL en Postman para probar la API:

http://localhost:8080/

##  Documentación

Puedes revisar la documentación Swagger de los endpoints de `users` y `pets` en las siguientes URLs:

- [http://localhost:8080/api/docs/users](http://localhost:8080/api/docs/users)
- [http://localhost:8080/api/docs/pets](http://localhost:8080/api/docs/pets)

---

##  Tests

Se realizan tests funcionales que validan tanto respuestas exitosas como errores esperados.

Para ejecutar los tests necesitas **dos terminales** (por ejemplo, usando Git Bash en Windows 11):

### Terminal 1 – Iniciar el servidor en modo test

```bash
NODE_ENV=test npm start
```

Esto levanta el servidor en el puerto 8081 con una base de datos de testing.

### Terminal 2 – Ejecutar los tests
```bash
 NODE_ENV=test npm test
```

Esto corre los tests funcionales con Mocha, Chai y Supertest.

### Ejemplo de salida esperada

```bash
Tests funcionales - router adoption
🧪 Respuesta de generateData: {
  status: 'success',
  message: 'Datos insertados correctamente',
  payload: { users: [ [Object] ], pets: [ [Object] ] }
}
    √ POST /api/adoptions/:uid/:pid debe registrar una adopción correctamente (297ms)
    √ GET /api/adoptions debe retornar todas las adopciones (56ms)
🟢 Conectado a la base de datos de testing
🟢 Conectado a la base de datos de testing
    √ GET /api/adoptions/:aid debe retornar una adopción específica (54ms)
    √ POST /api/adoptions/:uid/:pid con mascota ya adoptada debe fallar (114ms)
    √ POST /api/adoptions/:uid/:pid con usuario inexistente debe fallar (59ms)
    √ POST /api/adoptions/:uid/:pid con mascota inexistente debe fallar (104ms)
    √ POST /api/adoptions/:uid/:pid con IDs malformados debe fallar
    √ GET /api/adoptions/:aid con ID inexistente debe retornar 404 o error (63ms)
    √ GET /api/adoptions/:aid con ID malformado debe retornar error
🧹 Conexión cerrada correctamente

  Tests funcionales - router users
🧪 Respuesta de generateData: {
  status: 'success',
  message: 'Datos insertados correctamente',
  payload: { users: [ [Object] ], pets: [] }
}
    √ GET /api/users debe retornar todos los usuarios (51ms)
    √ GET /api/users/:uid debe retornar un usuario específico (49ms)
    √ GET /api/users/:uid con ID inexistente debe fallar (50ms)
    √ GET /api/users/:uid con ID malformado debe fallar
    √ PUT /api/users/:uid debe actualizar el usuario (108ms)
    √ PUT /api/users/:uid con ID inexistente debe fallar (53ms)
    √ DELETE /api/users/:uid debe eliminar el usuario (103ms)
    √ DELETE /api/users/:uid con ID inexistente debe fallar (60ms)
    √ DELETE /api/users/:uid con ID malformado debe fallar
🧹 Conexión cerrada correctamente


  18 passing (2s)


```


