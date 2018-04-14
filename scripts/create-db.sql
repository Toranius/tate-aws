-- Table: public.customers

-- DROP TABLE public.customers;

CREATE TABLE public.customers
(
  "idUtente" character varying(255) NOT NULL,
  "codiceCliente" character varying(255),
  "email" character varying(255),
  "nome" character varying(255),
  "cognome" character varying(255),
  "dataNascita" character varying(255),
  "codiceFiscale" character varying(255),
  "stato" character varying(255),
  "attivo" character varying(255),
  "nuovo" character varying(255),
  "rete" character varying(255),
  "agente" character varying(255),
  "canoneRai" character varying(255),
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  CONSTRAINT customers_pkey PRIMARY KEY ("idUtente")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.customers
  OWNER TO tatetate;