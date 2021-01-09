-- Database: viajes

-- DROP DATABASE viajes;

CREATE DATABASE viajes
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
	
CREATE TABLE CJV_Pais (
	id numeric(3) not null primary key, 
	nombre varchar(30) not null,
	continente varchar(7) not null,
	nacionalidad varchar(50) not null,
	descripcion varchar(1500) not null,
	constraint nombre_continente check(continente in ('America','Europa','Asia','Oceania','Africa'))
);

CREATE TABLE CJV_Ciudad (
	id numeric(4) not null,
	id_pais numeric(3) not null,
	nombre varchar(30) not null, 
	descripcion varchar(1500) not null, 
	constraint pk_ciudad primary key (id, id_pais),
	constraint fk_pais foreign key (id_pais) references CJV_Pais(id)
);

CREATE TABLE CJV_Atraccion(
	id_pais numeric(3) not null,
	id_ciudad numeric(4) not null ,
	id numeric(4) not null,
	nombre varchar(30) not null, 
	descripcion varchar(1500) not null, 
	constraint pk_atraccion primary key (id,id_ciudad,id_pais),
	constraint fk_ciudad Foreign Key (id_ciudad, id_pais) references CJV_ciudad(id,id_pais)
);

CREATE TABLE CJV_Agencia(
	id numeric(2) not null primary key, 
	nombre varchar(25) not null, 
	descripcion varchar(1500) not null, 
	pag_web varchar(200) not null,
	alcance char not null,
	operacion varchar(10) not null, 
	constraint tipo_alcance check (alcance in ('I','N','L')),
	constraint tipo_operacion check (operacion in ('operadoras','minorista','mayorista','mixta'))
);

CREATE TABLE CJV_Asociacion(
	id_agencia1 numeric(2) not null,
	id_agencia2 numeric(2) not null, 
	fecha_inicio date not null, 
	fecha_fin date, 
	constraint pk_asociacion primary key (id_agencia1, id_agencia2, fecha_inicio),
	constraint fk_agencia1 foreign key (id_agencia1) references CJV_Agencia(id),
	constraint fk_agencia2 foreign key (id_agencia2) references CJV_Agencia(id)
);

CREATE TABLE CJV_Area_Interes(
	id numeric(2) not null primary key,
	nombre varchar(50) not null, 
	descripcion varchar(300) not null
);

CREATE TABLE CJV_Agen_Int(
	id_agencia numeric(2) not null,
	id_area_interes numeric(2) not null,
	constraint pk_agencia_interes primary key (id_agencia, id_area_interes),
	constraint fk_agencia foreign key (id_agencia) references CJV_Agencia(id),
	constraint fk_interes foreign key (id_area_interes) references CJV_Area_Interes(id)
);

CREATE TABLE CJV_Proveedor(
	id numeric(2) not null primary key,
	nombre varchar(100) not null
);

CREATE TABLE CJV_Historico_Proveedor(
	id_agencia numeric(2) not null,
	id_proveedor numeric(2) not null,
	fecha_inicio date not null,
	fecha_fin date,
	constraint pk_historico_proveedor primary key (id_agencia, id_proveedor, fecha_inicio),
	constraint fk_agencia foreign key (id_agencia) references CJV_Agencia(id),
	constraint fk_proveedor foreign key (id_proveedor) references CJV_Proveedor(id)
	
);

CREATE TABLE CJV_Descuento(
	id_agencia numeric(2) not null,
	id numeric(3) not null,
	fecha_inicio date not null,
	nombre varchar(50) not null,
	porcentaje numeric(3) not null, 
	motivo varchar(500) not null,
	fecha_fin date
);

CREATE TABLE CJV_Vendedor(
	id numeric(4) not null primary key,
	primer_nombre varchar(50) not null,
	primer_apellido varchar(50) not null,
	fecha_nacimiento date not null, 
	genero char not null,
	id_agencia numeric(2) not null,
	segundo_nombre varchar(50),
	segundo_apellido varchar(50), 
	constraint tipo_genero check (genero in ('F','M')),
	constraint fk_agencia foreign key (id_agencia) references CJV_Agencia(id)
);

CREATE TABLE CJV_Paquete(
	id_agencia numeric(2) not null,
	id numeric(3) not null,
	nombre varchar(50) not null,
	descripcion varchar(240) not null, 
	dias_duracion numeric(3) not null,
	max_num_viajeros numeric(2),
	constraint pk_paquete primary key (id_agencia, id),
	constraint fk_agencia foreign key (id_agencia) references CJV_Agencia(id)
);

create table CJV_especializacion (
	id_area_interes numeric(4) not null,
	id numeric(5) not null,
	id_agencia numeric(3),
	id_vendedor numeric(3),
	id_agencia_paquete numeric(3),
	id_paquete numeric(4),
	id_pais numeric(3),
	id_ciudad numeric(4),
	id_atraccion numeric(4),
	comentario varchar(300),
	constraint pk_especializacion primary key (id_area_interes,id),
	constraint fk_area_interes foreign key (id_area_interes)references CJV_area_interes(id),
	constraint fk_agencia foreign key (id_agencia)references CJV_agencia(id),
	constraint fk_paquete foreign key (id_agencia_paquete,id_paquete) references CJV_paquete(id_agencia,id),
	constraint fk_atraccion foreign key (id_pais,id_ciudad,id_atraccion) references CJV_atraccion(id_pais,id_ciudad,id)
	);
CREATE TABLE CJV_Calendario_Anual(
 id_agencia numeric(2) not null, 
id_paquete numeric(3) not null, 
	fecha_salida date not null, 
	descripcion varchar(240),
	constraint pk_calendario_anual primary key (id_agencia,id_paquete, fecha_salida),
	constraint fk_paquete foreign key (id_agencia,id_paquete) references CJV_Paquete(id_agencia,id)
	
);

CREATE TABLE CJV_Itinerario(
	 id_agencia numeric(2) not null, 
id_paquete numeric(3) not null,
	id numeric(3) not null,
	secuencia numeric(4) not null,
	tiempo_estancia_dias numeric(2) not null,
	id_pais numeric(2) not null, 
	id_ciudad numeric(3) not null,
	constraint pk_itinerario primary key (id_agencia, id_paquete, id),
	constraint fk_ciudad foreign key(id_pais,id_ciudad) references CJV_Ciudad(id_pais,id)
	
);


CREATE TABLE CJV_Itin_Atraccion(
	id_agencia numeric(2) not null, 
id_paquete numeric(3) not null,
	id_itinerario numeric(3) not null,
	id_pais numeric(2) not null,
	id_ciudad numeric(3) not null,
	id_atraccion numeric(3) not null,
	orden numeric(3),
	constraint pk_itin_atraccion primary key(id_agencia,id_paquete,id_itinerario),
	constraint fk_itinerario foreign key(id_agencia, id_paquete, id_itinerario) references CJV_Itinerario(id_agencia,id_paquete,id),
	constraint fk_atraccion foreign key(id_pais, id_ciudad, id_atraccion) references CJV_Atraccion(id_pais,id_ciudad,id)
);


CREATE TABLE CJV_Servicio_Detalle(
	id_agencia numeric(2) not null,
	id_paquete numeric(3) not null,
	id numeric(3) not null,
	nombre varchar(50) not null,
	detalle varchar(240) not null,
	tipo_servicio varchar(50) not null,
	comida boolean,
	constraint pk_servicio_detalle primary key (id_agencia, id_paquete, id),
	constraint fk_paquete foreign key (id_agencia,id_paquete) references CJV_Paquete(id_agencia, id)
);


CREATE TABLE CJV_Lugar_Hotel(
id numeric(3) not null primary key,
	nombre varchar(50) not null,
	id_pais numeric(2) not null,
	id_ciudad numeric(3) not null,
	constraint  fk_ciudad foreign key (id_pais,id_ciudad) references CJV_Ciudad(id_pais,id)
);


CREATE TABLE CJV_Det_Hotel(
	id_agencia numeric(2) not null, 
	id_paquete numeric(3) not null,
	id_servicio numeric(3) not null,
	id_hotel numeric(3) not null,
	constraint pk_det_hotel primary key (id_agencia,id_paquete, id_servicio, id_hotel),
	constraint fk_servicio foreign key (id_agencia, id_paquete, id_servicio) references CJV_Servicio_Detalle(id_agencia, id_paquete, id)
);


CREATE TABLE CJV_Historico_Precio(
	id_agencia numeric(2) not null, 
	id_paquete numeric(3) not null,
	fecha_inicio date not null,
	valor_base numeric(5) not null,
	fecha_fin date,
	constraint pk_historico_precio primary key (id_agencia,id_paquete, fecha_inicio),
	constraint fk_paquete foreign key(id_agencia,id_paquete) references CJV_Paquete(id_agencia,  id)
);

CREATE TABLE CJV_Viajero(
id numeric(3) not null primary key,
	primer_nombre varchar(50) not null,
	primer_apellido varchar(50) not null,
	fecha_nacimiento date not null, 
	genero char not null,
	doc_identidad varchar(10) not null,
	id_pais numeric(2) not null,
	segundo_nombre varchar(50),
	segundo_apellido varchar(50), 
	constraint tipo_genero check (genero in ('F','M')),
	constraint tipo_doc_identidad check (doc_identidad in ('cedula','pasaporte', 'licencia')),
	constraint fk_pais foreign key (id_pais) references CJV_Pais(id)
	
);

CREATE TABLE CJV_Pasaporte(
	id_pais numeric(2) not null,
	id_viajero numeric(3) not null,
	num_pasaporte numeric(6) not null,
	fecha_vencimiento date not null,
	constraint pk_pasaporte primary key (id_pais, id_viajero, num_pasaporte),
	constraint fk_viajero foreign key (id_viajero) references CJV_Viajero(id),
	constraint fk_pais foreign key (id_pais) references CJV_Pais(id)
);

CREATE TABLE CJV_Registro_Viajero(
id_agencia numeric(2) not null,
id_viajero numeric(3) not null,
	fecha_inicio date not null, 
	fecha_fin date,
	constraint pk_registro_viajero primary key (id_agencia,id_viajero, fecha_inicio),
	constraint fk_agencia foreign key (id_agencia) references CJV_Agencia(id),
	constraint fk_viajero foreign key (id_viajero) references CJV_Viajero(id)
);

CREATE TABLE CJV_Cliente (
id numeric(3) not null primary key,
nombre varchar(50) not null, 
	tipo_cliente char not null,
	num_rif varchar(10),
	fecha_nacimiento date,
	segundo_nombre varchar(50),
	primer_apellido varchar(50),
	segundo_apellido varchar(50),
	constraint check_tipo_cliente check (tipo_cliente in ('P','J'))
	
 );
 
 CREATE TABLE CJV_Registro_Cliente(
 id_agencia numeric(2) not null, 
	 id_cliente numeric(3) not null,
	 fecha_inicio date not null,
	 fecha_fin date,
	 constraint pk_registro_cliente primary key  (id_agencia,id_cliente, fecha_inicio),
	 constraint fk_agencia foreign key (id_agencia) references CJV_Agencia(id),
	 constraint fk_cliente foreign key (id_cliente) references CJV_Cliente(id)
 );
 
 CREATE TABLE CJV_Paquete_Contrato(
 	id numeric(3) not null primary key, 
	 fecha_creacion date not null,
	 fecha_aprobado date not null,
	 fecha_viaje date not null,
	 num_factura numeric(5) unique not null,
	 email_valoracion varchar(40) not null,
	 id_agencia_paquete numeric(2) not null,
	 id_paquete numeric(3) not null, 
	 id_vendedor numeric(3) not null,
	 id_agencia_registro numeric(2) not null,
	 id_cliente_registro numeric(3) not null,
	 fecha_registro date not null,
	 constraint fk_paquete foreign key(id_agencia_paquete, id_paquete) references CJV_Paquete(id_agencia, id),
	 constraint fk_vendedor foreign key(id_vendedor) references CJV_Vendedor(id),
	 constraint fk_registro_cliente foreign key (id_agencia_registro,id_cliente_registro,fecha_registro) references CJV_Registro_Cliente(id_agencia, id_cliente,fecha_inicio)
	 
 ); 
 
 CREATE TABLE CJV_Cont_Reg_Viajero(
 	id_contrato numeric(3) not null,
	 id_agencia_registro numeric(2) not null, 
	 id_viajero_registro numeric(3) not null,
	 id_registro_registro date not null,
	 constraint pk_contrato_viajero primary key (id_contrato, id_agencia_registro, id_viajero_registro,id_registro_registro ),
	 constraint fk_contrato foreign key (id_contrato) references CJV_Paquete_Contrato(id),
	 constraint fk_registro_viajero foreign key (id_agencia_registro,id_viajero_registro,id_registro_registro) references CJV_Registro_Viajero(id_agencia, id_viajero,fecha_inicio)
	 
 );
 
 
 CREATE TABLE CJV_Banco(
 	id numeric(3) not null primary key,
	 nombre varchar(100) not null
 );
 
 CREATE TABLE CJV_Instrumento_Pago(
 id_cliente numeric(3) not null, 
	 id numeric(2) not null,
	 clasificacion varchar(10) not null,
	 id_banco numeric(3) not null,
	 numero numeric(15),
	 email varchar(100),
	 constraint pk_instrumento_pago primary key (id_cliente, id),
	 constraint fk_cliente foreign key (id_cliente) references CJV_Cliente(id),
	 constraint fk_banco foreign key (id_banco) references CJV_Banco(id)
 );
 
 CREATE TABLE CJV_Forma_Pago(
 id_contrato numeric(3) not null,
	 id_cliente numeric(3) not null, 
	 id_instrumento numeric(3) not null,
	 tipo_pago char not null,
	 constraint pk_forma_pago primary key (id_contrato, id_cliente, id_instrumento),
	 constraint fk_contrato foreign key (id_contrato) references CJV_Paquete_Contrato(id),
	 constraint fk_instrumento_pago foreign key (id_cliente, id_instrumento) references CJV_Instrumento_Pago(id_cliente, id),
	 constraint check_tipo_pago check (tipo_pago in ('T','D','C','E'))
 );

CREATE TABLE CJV_Rally(
	id numeric(3) not null primary key,
	nombre varchar(50) not null,
	fecha_inicio date not null,
	fecha_limite date not null,
	max_num_cupos numeric(3) not null,
	modalidad char not null, 
	costo_participacion numeric(5)not null, 
	informacion varchar(240) not null,
	constraint check_modalidad check (modalidad in ('I','P'))
	
);

create table CJV_circuito(
	id_pais numeric(3) not null,
	id_ciudad numeric(4) not null,
	id_rally numeric(5) not null,
	presendencia numeric(4) not null,
	num_max_dias numeric(2) not null,
	constraint pk_circuito primary key(id_pais, id_ciudad, id_rally),
	constraint fk_ciudad foreign key(id_pais, id_ciudad) references CJV_ciudad(id_pais,id),
	constraint fk_rally foreign key(id_rally) references CJV_rally(id)
);

create table CJV_atraccion_rally(
	id_pais numeric(3) not null,
	id_ciudad numeric(4) not null,
	id_rally numeric(5) not null,
	id_pais_atraccion numeric(3) not null,
	id_ciudad_atraccion numeric(4) not null,
	id_atraccion numeric(4) not null, 
	constraint pk_atraccion_rally primary key(id_pais,id_ciudad,id_rally,id_pais_atraccion,id_ciudad_atraccion,id_atraccion),
	constraint fk_circuito foreign key (id_pais,id_ciudad,id_rally) references CJV_circuito(id_pais,id_ciudad,id_rally),
	constraint fk_atraccion foreign key (id_pais_atraccion, id_ciudad_atraccion, id_atraccion) references CJV_atraccion(id_pais,id_ciudad,id)
);
create table CJV_organizador(
	id_agencia numeric(3) not null,
	id_rally numeric(5) not null,
	num_cupos numeric(4),
	constraint pk_organizador primary key (id_agencia, id_rally),
	constraint fk_rally foreign key (id_rally) references CJV_rally(id),
	constraint fk_agencia foreign key (id_agencia) references CJV_agencia(id)
);
create table CJV_participacion(
	id_rally numeric(5) not null,
	id numeric(5) not null,
	num_participacion numeric(5) not null,
	puesto_final numeric(5),
	fecha_culminacion date,
	id_agencia_viajero numeric(3), 
	id_viajero numeric(4),
	fecha_reg_viajero date, 
	id_agencia_cliente numeric(3),
	id_cliente numeric(4), 
	fecha_reg_cliente date,
	constraint pk_participacion primary key(id_rally, id),
	constraint fk_rally foreign key(id_rally) references CJV_rally(id),
	constraint fk_registro_viajero foreign key (id_agencia_viajero,id_viajero,fecha_reg_viajero) references CJV_registro_viajero(id_agencia,id_viajero,fecha_inicio),
	constraint fk_registro_cliente foreign key (id_agencia_cliente,id_cliente,fecha_reg_cliente) references CJV_registro_cliente(id_agencia,id_cliente,fecha_inicio)
);

create table CJV_premio(
	id_rally numeric(5) not null,
	id numeric(6) not null,
	nombre varchar(40) not null,
	puesto_destino numeric(2) not null,
	detalle varchar(300),
	constraint pk_premio primary key(id_rally, id),
	constraint fk_rally foreign key(id_rally) references CJV_rally(id)
);

create table CJV_valoracion(
	id numeric(6) not null primary key,
	id_pais numeric(3),
	id_pais_ciudad numeric(3),
	id_ciudad numeric(4),
	id_pais_atraccion numeric(3),
	id_ciudad_atraccion numeric(4),
	id_atraccion numeric(4),
	id_rally numeric(5),
	id_contrato numeric(5),
	constraint fk_pais foreign key (id_pais) references CJV_pais(id),
	constraint fk_ciudad foreign key (id_pais_ciudad,id_ciudad) references CJV_ciudad(id_pais,id),
	constraint fk_atraccion foreign key (id_pais_atraccion,id_ciudad_atraccion,id_atraccion) references CJV_atraccion(id_pais,id_ciudad,id),
	constraint fk_rally foreign key (id_rally) references CJV_rally(id),
	constraint fk_contrato foreign key (id_contrato) references CJV_paquete_contrato(id)
);

create table CJV_imagen(
	id numeric(6) not null primary key,
	url_imagen varchar(500) not null,
	id_pais numeric(3),
	id_ciudad numeric(4),
	id_atraccion numeric(4),
	id_agencia numeric(3),
	id_paquete numeric(4),
	id_itinerario numeric(5),
	constraint fk_atraccion foreign key(id_pais,id_ciudad,id_atraccion) references CJV_atraccion(id_pais,id_ciudad,id),
	constraint fk_itinerario foreign key(id_agencia,id_paquete,id_itinerario) references CJV_itinerario(id_agencia,id_paquete,id)
);
