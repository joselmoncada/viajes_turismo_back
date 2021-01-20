
/**CONSULTA TABLAS**/
select tablename as nombre from pg_tables as t1 where t1.schemaname = 'public';


/**CONSULTA CONSTRAINTS**/
select conname as nombre_constraint from pg_constraint;


/**CONSULTA SECUENCIAS**/
select sequencename as nombre_seq, 
data_type as tipo,
start_value as inicia, 
max_value as termina from pg_sequences;


/**CONSULTA INDICES**/
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public' AND
	indexname like 'cjv_i%'
ORDER BY
    tablename,
    indexname;