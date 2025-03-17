#Optimización de Consultas en MongoDB: Configuración de Índices y Análisis de Rendimiento usando MongoDB Shell y Node.js con Mongoose.


##Funcionamiento:

El funcionamiento de esta API no va tan enfocada en la creación de cosas como en las anteriores APIs, a pesar de que se crean los datos e índices, sin embargo, se da prioridad al uso de los índices en MongoDB para analizar el rendimiento. La estructura es la básica de una API, poseyendo una configuración que conecta al servidor local mongoDB con mongoose, modelos que definen el esquema de carro, las rutas, el servidor que permite el uso de la API, los controladores que contienen el funcionamiento de la creación de datos, índices y las consultas con y sin índices. Por último el ThunderClient, siendo cada uno necesario para funcionar.


##Tecnologías empleadas:

Se utiliza Node.js es un entorno de ejecución de JavaScript y Mongoose.

Se consultó a la siguiente página web para conocer algunas categorías y marcas de los autos:
[Clasificación de automóviles](https://es.wikipedia.org/wiki/Clasificaci%C3%B3n_de_autom%C3%B3viles#M%C3%A9todos_de_clasificaci%C3%B3n)


##Imágenes Thunder Client de consultas sin y con índices:

Crear 100,000 carros.

![CreateCars(100000)](/assets/CreateCars(100000).png)

Visualización en Compass de crear 100,000 carros.

![CreateCars(100000)Compass](/assets/CreateCars(100000)Compass.png)

Se realiza la primer consulta sin índice.

![queryWithoutIndex1](/assets/queryWithoutIndex1.png)

Se realiza la segunda consulta sin índice.

![queryWithoutIndex2](/assets/queryWithoutIndex2.png)

Se realiza la tercer consulta sin índice.

![queryWithoutIndex3](/assets/queryWithoutIndex3.png)

Se crea los tres índices: simple, compuesto y texto.

![createIndexes](/assets/createIndexes.png)

Visualización en Compass de crear los tres índices.

![createIndexesCompass](/assets/createIndexesCompass.png)

Se realiza consulta con índice simple.

![queryIndex1](/assets/queryIndex1.png)

Se realiza consulta con índice compuesto.

![queryIndex2](/assets/queryIndex2.png)

Se realizó una consulta con índice de texto que buscaba "Carro 90000", sin embargo, duraba mucho más que el que no tiene índice. La causa de esto es porque cuando realiza la búsqueda, toma por valores separados "carro" y "90000", por lo que terminaba buscando todos los valores que cumplían ese requisito, es decir, todos.

![queryIndex3Test](/assets/queryIndex3Test.png)

Identificando esto, se realizó una consulta con índice de texto solo definiendo "90000" como cadena y fue demasiado más rápido que sin índice.

![queryIndex3](/assets/queryIndex3.png)


##Manual de instalación:

```npm  init —yes```  Para inicializar. El —yes es para que todo lo que pregunte al ejecutarlo, automáticamente seleccione “yes”.

```npm install express mongooose dotenv nodemon -D``` mongoose gestiona las relaciones entre los datos, proporciona validación de esquemas y se utiliza para traducir entre objetos en código y la representación de esos objetos en MongoDB. express permite manejar rutas y peticiones en el servidor. dontev carga variables de entorno desde un archivo .env. nodemon -D para actualizar automáticamente.

```npm run dev``` Para conectarse al servidor, teniendo previa configuración en los scripts.

Tener instalado ThunderClient para utilizar la API.


###Justificación de modelado:

La estructura de la API para evaluar el rendimiento de consultas sin y con índices presentó un modelo de completa libertad, ya que no es lo principal.
Definí un modelado de carros, el cual posee nombre para enumerar el carro (carro 1) y facilitar su uso en ciertas consultas, categorías y fecha de creación del carro, marca, precio y stock. También se pudo haber considerado el modelo, pero, al utilizar random para asignar los datos, surgiría una revoltura entre marca y modelo.
Las consultas determinadas tuvieron una complejidad variante para cumplir con los tipos índices (simple, compuesto y texto), siempre buscando que los índices sean beneficiantes, ya que, si se asigna un índice donde no amerita o se utiliza incorrectamente, podría mantenerse igual o incluso empeorar. Esta afirmación se reafirma al utilizar el tercer índice de texto, donde fue mucho más lento al tomar por separado cada espacio que presentaba la cadena.
Teniendo presente que las consultas fueron definidas en base a los índices para procurar la eficiencia: los índices establecidos resultaron más eficientes al realizar las búsquedas porque evitan que se realizar un recorrido completo de los documentos de la colección hasta encontrar el dato que cumpla con el parámetro definido. 

A continuación la justificación de la selección de cada índice:

Índice en category ```({ category: 1 })``` mejora la consulta con el filtrado por categoría, ya que los datos se organizan y acceden rápidamente sin recorrer toda la colección.

Índice compuesto en brand y price ```({ brand: 1, price: -1 })``` optimiza consultas que filtran por marca y ordenan por precio de mayor a menor. La elección de este índice fue porque, siendo lógicos y tomando de ejemplo una marca, el Bugatti es una marca de autos con un precio bastante elevado, por lo que beneficia comenzar el recorrido de la consulta desde los carros más caros a los más baratos. Esto no resulta completamente funcional a causa de que los precios fueron colocados de forma aleatoria, pero en un caso real sí, aún así fue útil por el filtrado.

Índice de texto en name ```({ name: "text" }``` permite consultar con palabras o términos claves en name, dependiendo de las necesidades, en lugar de escanear y recorrer completamente con $regex, reduciendo la cantidad de documentos revisados.