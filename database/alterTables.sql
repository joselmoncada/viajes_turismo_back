CREATE SEQUENCE cjv_s_cliente
	start with 1 increment by 1 MAXVALUE 999999999;

drop sequence cjv_s_circuito;
      
alter table cjv_cliente
	alter column id type numeric(9),
	add constraint u_num_rif unique(num_rif),
	add constraint u_documento unique(documento),
	add column documento numeric(9);

alter table CJV_registro_cliente
	alter column id_cliente type numeric(9);
alter table CJV_paquete_contrato
	alter column id_cliente type numeric(9);
alter table CJV_instrumento_pago
	rename email_valoracion to email;
alter table CJV_instrumento_pago	
	alter column id_cliente type numeric(9);
alter table CJV_forma_pago
	alter column id_cliente type numeric(9);
alter table CJV_participacion
	alter column id_cliente type numeric(9);


alter table cjv_pasaporte 
alter column num_pasaporte type numeric(9),
alter column id_viajero type numeric(9);
alter table cjv_registro_viajero
alter column id_viajero type numeric(9);
alter table cjv_registro_viajero
rename fecha_vencimiento to fecha_fin;
alter table CJV_participacion
alter column id_viajero type numeric(9);
alter table CJV_cont_reg_viajero
alter column id_viajero type numeric(9);
ALTER TABLE public.cjv_pasaporte DROP CONSTRAINT pk_pasaporte;
ALTER TABLE public.cjv_pasaporte
    ADD CONSTRAINT pk_pasaporte PRIMARY KEY (id_pais, id_viajero, num_pasaporte);