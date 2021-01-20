CREATE INDEX cjv_i_descuento 
on cjv_descuento(id_agencia,fecha_inicio);

CREATE INDEX cjv_i_itinerario 
on cjv_itinerario(id_agencia,secuencia);

CREATE INDEX cjv_i_servicio_detalle 
on cjv_servicio_detalle(id_agencia,tipo_servicio);

CREATE INDEX cjv_i_rally 
on cjv_rally(fecha_inicio);

CREATE INDEX cjv_i_participacion 
on cjv_participacion(id_rally, num_participacion);