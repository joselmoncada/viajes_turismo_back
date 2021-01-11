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

-- SET DateStyle TO European;

create table CJV_Pais(
	id numeric(3) not null primary key,
	nombre varchar(30) not null,
	continente varchar(7) not null,
	nacionalidad varchar(40) not null,
	descripcion varchar(1500) not null,
	constraint tipo_continente check( continente in ('America','Europa','Asia','Africa','Oceania'))
);

create table CJV_Ciudad(
	id_pais numeric(3) not null,
	id numeric(4) not null,
	nombre varchar(50) not null,
	descripcion varchar(1000) not null,
	constraint pk_ciudad primary key ( id, id_pais),
	constraint fk_pais foreign key(id_pais) references CJV_pais(id)
);

create table CJV_atraccion(
	id_pais numeric(3) not null,
	id_ciudad numeric(4) not null ,
	id numeric(4) not null,
	nombre varchar(50) not null,
 	descripcion varchar(1000) not null,
	url_imagen varchar(500) not null,
	constraint pk_atraccion primary key (id,id_ciudad,id_pais),
	constraint fk_ciudad Foreign Key (id_ciudad, id_pais) references CJV_ciudad(id,id_pais)
);

create table CJV_agencia(
	id numeric(3) not null primary key,
	nombre varchar(40) not null,
	descripcion varchar(300) not null,
	pagina_web varchar(256) not null,
	alcance varchar not null,
	operacion varchar(10) not null,
	constraint tipo_alcance check(alcance in('I','N','L')),
	constraint tipo_operacion check(operacion in('operadoras','minorista','mayorista','mixta'))
);

create table CJV_asociacion(
	id_agencia1 numeric(3) not null,
	id_agencia2 numeric(3) not null,
	fecha_inicio date not null,
	fecha_fin date ,
	constraint pk_asociacion primary key(id_agencia1,id_agencia2,fecha_inicio),
	constraint fk_agencia1 foreign key (id_agencia1) references CJV_agencia(id),
	constraint fk_agencia2 foreign key (id_agencia2) references CJV_agencia(id)
);

create table CJV_area_interes(
	id numeric(3) not null primary key,
	nombre varchar(30) not null,
	descripcion varchar(300) not null
);

create table CJV_agen_int(
	id_agencia numeric(3) not null,
	id_area_interes numeric(3) not null,
	constraint pk_agencia_interes primary key(id_agencia,id_area_interes), 
	constraint fk_agencia foreign key (id_agencia) references CJV_agencia(id),
	constraint fk_area_interes  foreign key (id_area_interes) references CJV_area_interes(id)
);


create table CJV_descuento(
	id_agencia numeric(3) not null,
	id numeric(3)not null,
	fecha_inicio date not null,
	nombre varchar(50)not null,
	porcentaje numeric(3)not null,
	motivo varchar(200)not null,
	fecha_fin date,
	constraint pk_descuento primary key(id_agencia,id),
	constraint fk_agencia foreign  key(id_agencia) references CJV_agencia(id)
);

create table CJV_proveedor(
	id numeric(3) not null primary key,
	nombre varchar(40) not null
);

create table CJV_historico_proveedor(
	id_agencia numeric(3) not null,
	id_proveedor numeric(3) not null,
	fecha_inicio date not null,
	fecha_fin date,
	constraint pk_historico_proveedor primary key(id_agencia,id_proveedor,fecha_inicio),
	constraint fk_agencia foreign key(id_agencia) references CJV_agencia(id),
	constraint fk_proveedor foreign key(id_proveedor) references CJV_proveedor(id)
);

create table CJV_vendedor(
	id numeric(3) not null primary key,
	primer_nombre varchar(20) not null,
	primer_apellido varchar(20) not null,
	fecha_nacimiento date not null,
	genero char not null,
	id_agencia numeric(3) not null,
	segundo_nombre varchar(20),
	segundo_apellido varchar(20),
	constraint tipo_genero check(genero in('F','M')),
	constraint fk_agencia foreign key(id_agencia) references CJV_agencia(id)
);

create table CJV_paquete(
	id_agencia numeric(3) not null,
	id numeric(4) not null,
	nombre varchar(50)not null,
	descripcion varchar(300)not null,
	dias_duracion numeric(3)not null,
	max_num_viajeros numeric(2),
	constraint pk_paquete primary key(id_agencia,id),
	constraint fk_agencia foreign key(id_agencia) references CJV_agencia(id)
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
create table CJV_calendario_anual (
	id_agencia numeric(3) not null,
	id_paquete numeric(4) not null,
	fecha_salida date not null,
	descripcion varchar(300) not null,
	constraint pk_calendario primary key (id_agencia, id_paquete, fecha_salida),
	constraint fk_paquete foreign key (id_agencia,id_paquete) references CJV_paquete(id_agencia,id)
);
create table CJV_itinerario (
	id_agencia numeric(3) not null,
	id_paquete numeric(4) not null,
	id numeric(5) not null,
	secuencia numeric(2) not null,
	tiempo_estancia_dias numeric(2) not null,
	id_pais numeric(3) not null,
	id_ciudad numeric(4) not null,
	constraint pk_itinerario primary key(id_agencia, id_paquete, id),
	constraint fk_paquete foreign key(id_agencia, id_paquete) references CJV_paquete(id_agencia,id),
	constraint fk_ciudad foreign key(id_pais, id_ciudad) references CJV_ciudad(id_pais,id)
);

create table CJV_itin_atraccion (
	id_agencia numeric(3) not null,
	id_paquete numeric(4) not null,
	id_itinerario numeric(5) not null,
	id_pais numeric(3) not null,
	id_ciudad numeric(4) not null,
	id_atraccion numeric(4) not null,
	orden numeric(3),
	constraint pk_itinerario_atraccion primary key (id_agencia,id_paquete,id_itinerario,id_pais,id_ciudad,id_atraccion),
	constraint fk_intinerario foreign key (id_agencia,id_paquete,id_itinerario) references CJV_itinerario(id_agencia,id_paquete,id),
	constraint fk_atraccion foreign key(id_pais,id_ciudad,id_atraccion) references CJV_atraccion(id_pais,id_ciudad,id)
);

create table CJV_servicio_detalle (
	id_agencia numeric(3) not null,
	id_paquete numeric(4) not null,
	id numeric(4) not null,
	nombre varchar(50)  not null,
	descripcion varchar(300) not null,
	tipo_servicio varchar(20) not null,
	comida boolean,
constraint check_servicio check( tipo_servicio in ('hospedaje','alquiler_auto','vuelo','crucero','ferry')),
	constraint pk_servicio primary key(id_agencia,id_paquete,id),
	constraint fk_paquete foreign key(id_agencia,id_paquete) references CJV_paquete(id_agencia,id)
);

create table CJV_lugar_Hotel (
	id numeric(4) not null primary key,
	nombre varchar(40) not null, 
	id_pais numeric(3) not null,
	id_ciudad numeric(4) not null,
	constraint fk_ciudad foreign key(id_pais, id_ciudad) references CJV_ciudad(id_pais,id)
);
create table CJV_det_hotel (
	id_agencia numeric(3) not null,
	id_paquete numeric(4) not null,
	id_servicio numeric(4) not null,
	id_hotel numeric(4) not null,
	constraint pk_detalle_hotel primary key (id_agencia, id_paquete, id_servicio, id_hotel),
	constraint fk_detalle_servicio foreign key (id_agencia, id_paquete, id_servicio) references CJV_servicio_detalle(id_agencia, id_paquete, id),
	constraint fk_lugar_hotel foreign key (id_hotel) references CJV_lugar_hotel(id)
);

create table CJV_historico_precio (
	id_agencia numeric(3) not null,
	id_paquete numeric(4) not null,
	fecha_inicio date not null,
	valor_base numeric(5) not null,
	fecha_fin date,
	constraint pk_historico primary key(id_agencia, id_paquete, fecha_inicio),
	constraint fk_paquete foreign key (id_agencia, id_paquete) references CJV_paquete(id_agencia, id)

);
create table CJV_viajero (
	documento numeric(9) not null primary key,
	primer_nombre varchar(20) not null,
	primer_apellido varchar(20) not null,
	fecha_nacimiento date not null,
	genero char not null,
	id_pais numeric(3) not null,
	segundo_nombre varchar(20),
	segundo_apellido varchar(20),
	constraint tipo_genero check( genero in('F','M')),
	constraint fk_pais foreign key( id_pais) references CJV_pais(id)
);

create table CJV_pasaporte( 
	id_pais numeric(3) not null,
	id_viajero numeric(4) not null,
	num_pasaporte numeric(5) not null,
	fecha_vencimiento date not null,
	constraint pk_pasaporte primary key(id_pais, id_viajero),
	constraint fk_pais foreign key(id_pais) references CJV_pais(id),
	constraint fk_viajero foreign key(id_viajero) references CJV_viajero(documento)
);

create table CJV_registro_viajero( 
	id_agencia numeric(3) not null,
	id_viajero numeric(4) not null,
	fecha_inicio date not null,
	fecha_vencimiento date,
	constraint pk_registro_viajero primary key(id_agencia, id_viajero,fecha_inicio),
	constraint fk_agencia foreign key(id_agencia) references CJV_agencia(id),
	constraint fk_viajero foreign key(id_viajero) references CJV_viajero(documento)
);

create table CJV_cliente( 
	id numeric(9) not null primary key,
	nombre varchar(40) not null,
	tipo_cliente char not null,
	num_rif numeric(13),
	fecha_nacimiento date,
	segundo_nombre varchar(20),
	primer_apellido varchar(20),
	segundo_apellido varchar(20),
	constraint check_cliente check( tipo_cliente in('P','J'))
);

create table CJV_registro_cliente( 
	id_agencia numeric(3) not null,
	id_cliente numeric(4) not null,
	fecha_inicio date not null,
	fecha_fin date,
	constraint pk_registro primary key(id_agencia,id_cliente,fecha_inicio),
	constraint fk_agencia foreign key (id_agencia) references CJV_agencia(id),
	constraint fk_cliente foreign key (id_cliente) references CJV_cliente(id)
);

create table CJV_paquete_contrato( 
	id numeric(5) not null primary key,
	total_neto numeric(6) not null,
	fecha_creacion date not null,
	fecha_aprobacion date not null,
	fecha_viaje date not null,
	num_factura numeric(5) not null unique,
	email_valoracion varchar(40) not null,
	id_agencia numeric(3) not null,
	id_paquete numeric(4) not null,
	id_vendedor numeric(3) not null,
	id_agencia_cliente numeric(3) not null,
	id_cliente numeric(4) not null,
	fecha_registro_cliente date not null,
	constraint fk_paquete foreign key(id_agencia, id_paquete) references CJV_paquete (id_agencia,id),
	constraint fk_vendedor foreign key(id_vendedor) references CJV_vendedor (id),
	constraint fk_cliente foreign key(id_agencia_cliente, id_cliente,fecha_registro_cliente) references CJV_registro_cliente (id_agencia,id_cliente,fecha_inicio)
);

create table CJV_cont_reg_viajero( 
	id_contrato numeric(5) not null,
	id_agencia numeric(3) not null,
	id_viajero numeric(4) not null,
	fecha_registro date not null,
	constraint pk_contrato_viajero primary key (id_contrato,id_agencia,id_viajero,fecha_registro),
	constraint fk_contrato foreign key (id_contrato) references CJV_paquete_contrato (id),
	constraint fk_registro_viajero foreign key (id_agencia,id_viajero,fecha_registro) references CJV_registro_viajero (id_agencia,id_viajero,fecha_inicio)
);

create table CJV_banco( 
	id numeric(4) not null primary key,
	nombre varchar(40) not null
);

create table CJV_instrumento_pago( 
	id_cliente numeric(4) not null,
	id numeric(6) not null,
	clasificacion varchar(12) not null,
	id_banco numeric(4) not null,
	numero numeric(16), 
	email_valoracion varchar(40),
	constraint tipo_instrumento check(clasificacion in ('t_credito', 't_debito', 'c_bancaria', 'zelle')),
	constraint pk_instrumento primary key (id_cliente, id),
	constraint fk_cliente foreign key (id_cliente) references CJV_cliente (id),
	constraint fk_banco foreign key (id_banco) references CJV_Banco (id)
);

create table CJV_forma_pago(
	id_contrato numeric(5) not null,
	id_cliente numeric(4) not null,
	id_instrumento numeric(6) not null,
	tipo char not null,
	constraint tipo_pago check(tipo in('T','D','C','E')),
	constraint pk_forma_pago primary key(id_contrato, id_cliente, id_instrumento),
	constraint fk_contrato foreign key(id_contrato) references CJV_paquete_contrato(id),
	constraint fk_instrumento foreign key(id_cliente,id_instrumento) references CJV_instrumento_pago(id_cliente, id)
);

create table CJV_rally(
	id numeric(5) not null primary key,
	nombre varchar(50) not null,
	fecha_inicio date not null,
	fecha_limite date not null,
	max_num_cupos numeric(4) not null,
	modalidad char not null,
	costo_participacion numeric(5) not null,
	informacion varchar(500),
	constraint tipo_modalidad check(modalidad in('I','P'))
);

create table CJV_circuito(
	id_pais numeric(3) not null,
	id_ciudad numeric(4) not null,
	id_rally numeric(5) not null,
	precedencia numeric(4) not null,
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
