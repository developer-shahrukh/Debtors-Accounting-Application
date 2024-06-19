ALTER TABLE ac_item ADD CONSTRAINT ac_uom_pkv1 PRIMARY KEY ( code );

ALTER TABLE ac_item ADD CONSTRAINT ac_uom__unv1 UNIQUE ( name );