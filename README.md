# Visual Bookmark

> **Aviso de EOL :warning:**: Este proyecto se creó en 2022 (refactorizado en 2024) con el objetivo de aprender sobre las tecnologías empleadas en su desarrollo. Actualmente, se considera finalizado. Sin embargo, se ha decidido liberar el código por si a alguien le es de utilidad. :blue_heart:

Visual Bookmark es una aplicación para la gestión visual de marcadores. Este proyecto es una herramienta **databaseless** que permite organizar y administrar los marcadores de manera intuitiva.

## Tecnologías Utilizadas

- **Front-end**: 
  - **HTML**
  - **CSS**
  - **JavaScript**
    + Con la ayuda de librerías **Bootstrap** para mejorar el diseño y la funcionalidad.
- **Back-end**: 
  - **Node.js**
  - **Express**
  - **Multer**: Middleware para el manejo de archivos.
- **Persistencia**: 
  - **Archivo JSON**

## Notas Adicionales

Cabe mencionar que algunas decisiones de desarrollo se tomaron para explorar las tecnologías empleadas, saliéndose de los ejemplos estudiados. Algunas decisiones destacables fueron:

- **Ruta "upload_bookmarks"** para crear y modificar un marcador, en lugar de utilizar por separado las típicas operaciones CRUD.
- **Diferenciación entre "numBookmarks" y "numMaxId"** en `bookmarks.json`, esta separación se implementó para permitir la fusión de archivos `bookmarks.json` de diferentes momentos, facilitando la integración de datos.

Además, en cuanto a la mantenibilidad y posible uso, es importante mencionar que, dada la naturaleza del proyecto:
- La única documentación generada ha sido este documento y los comentarios del código.
- Las pruebas realizadas han sido todas "ad hoc", sin que se hayan realizado pruebas automatizadas.
- Algunas de las imprementaciones realizadas necesitan una refactorización para mejorar el rendimiento.

## Instalación

Se debe clonar el repositorio:

```bash
git clone https://github.com/adrianDelRio/visualBookmark.git
```

Luego, se debe mover al directorio creado:

```
cd visualBookmark
```

Se deben instalar las dependencias:

```
npm install
```

Finalmente, se puede ejecutar el proyecto como desarrollador **o** usuario:

```
npm run dev
```
```
npm run start
```