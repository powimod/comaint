-- Project comaint 
-- Database schema version 1
-- MySQL Database initialization script

-- CREATE SCHEMA db_comaint;
USE db_comaint
-- CREATE USER 'comaint'@'localhost' IDENTIFIED BY 'g4m0-KauM1nt';
-- GRANT ALL PRIVILEGES ON db_comaint.* TO 'comaint'@'localhost';


--------------------------------------------------------------------------------
--     Tables                                                                 --
--------------------------------------------------------------------------------


--
-- Table offers
--
CREATE TABLE offers(
	id INTEGER NOT NULL auto_increment,
	title VARCHAR(64) NOT NULL,
	description TEXT NOT NULL,
	active BOOLEAN NOT NULL DEFAULT true,
	duration INTEGER NOT NULL DEFAULT '0',
	price DECIMAL(8,2) NOT NULL DEFAULT '0',
	user_limit INTEGER NOT NULL DEFAULT '0',
	equipment_limit INTEGER NOT NULL DEFAULT '0',
	article_limit INTEGER NOT NULL DEFAULT '0',
	intervention_limit INTEGER NOT NULL DEFAULT '0',
	storage_limit INTEGER NOT NULL DEFAULT '0',
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_title ON offers(
	title
	);

--
-- Table subscriptions
--
CREATE TABLE subscriptions(
	id INTEGER NOT NULL auto_increment,
	id_offer INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	status TINYINT NOT NULL,
	price DECIMAL(8,2) NOT NULL,
	PRIMARY KEY (id)
);


CREATE INDEX idx_offer ON subscriptions(
	id_offer
	);
CREATE INDEX idx_company ON subscriptions(
	id_company
	);

--
-- Table companies
--
CREATE TABLE companies(
	id INTEGER NOT NULL auto_increment,
	id_manager INTEGER,
	name VARCHAR(64) NOT NULL,
	locked BOOLEAN NOT NULL DEFAULT false,
	address TEXT NOT NULL DEFAULT '',
	city TEXT NOT NULL DEFAULT '',
	zip_code TEXT NOT NULL DEFAULT '',
	country TEXT NOT NULL DEFAULT '',
	logo_uid VARCHAR(36) NOT NULL,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_name ON companies(
	name
	);

--
-- Table users
--
CREATE TABLE users(
	id INTEGER NOT NULL auto_increment,
	id_company INTEGER,
	email VARCHAR(96) NOT NULL,
	password VARCHAR(70) NOT NULL,
	firstname VARCHAR(30) NOT NULL,
	lastname VARCHAR(30) NOT NULL,
	account_locked BOOLEAN NOT NULL DEFAULT false,
	validation_code INTEGER DEFAULT '0',
	phone VARCHAR(25) DEFAULT '',
	active BOOLEAN NOT NULL DEFAULT true,
	last_use DATETIME,
	administrator BOOLEAN NOT NULL DEFAULT false,
	stock_role TINYINT DEFAULT '0',
	park_role TINYINT DEFAULT '0',
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_email ON users(
	email
	);
CREATE UNIQUE INDEX idx_idx_company_lastname_firstname ON users(
	id_company,
	lastname,
	firstname
	);
CREATE INDEX idx_idx_company ON users(
	id_company
	);

--
-- Table tokens
--
CREATE TABLE tokens(
	id INTEGER NOT NULL auto_increment,
	id_user INTEGER NOT NULL,
	expires_at DATETIME NOT NULL,
	PRIMARY KEY (id)
);


CREATE INDEX idx_idx_user ON tokens(
	id_user
	);

--
-- Table units
--
CREATE TABLE units(
	id INTEGER NOT NULL auto_increment,
	id_company INTEGER NOT NULL,
	name VARCHAR(32) NOT NULL,
	description VARCHAR(255),
	address TEXT NOT NULL DEFAULT '',
	city TEXT NOT NULL DEFAULT '',
	zip_code TEXT NOT NULL DEFAULT '',
	country TEXT NOT NULL DEFAULT '',
	plan_uid VARCHAR(36) NOT NULL,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_company_name ON units(
	id_company,
	name
	);

--
-- Table sections
--
CREATE TABLE sections(
	id INTEGER NOT NULL auto_increment,
	id_unit INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	name VARCHAR(32) NOT NULL,
	x_pos INTEGER NOT NULL DEFAULT '-1',
	y_pos INTEGER NOT NULL DEFAULT '-1',
	x_size INTEGER NOT NULL DEFAULT '-1',
	y_size INTEGER NOT NULL DEFAULT '-1',
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_unit_name ON sections(
	id_unit,
	name
	);

--
-- Table equipment_families
--
CREATE TABLE equipment_families(
	id INTEGER NOT NULL auto_increment,
	id_company INTEGER NOT NULL,
	name VARCHAR(32) NOT NULL,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_company_name ON equipment_families(
	id_company,
	name
	);

--
-- Table equipment_types
--
CREATE TABLE equipment_types(
	id INTEGER NOT NULL auto_increment,
	id_equipment_family INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	name VARCHAR(32) NOT NULL,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_equipmentfamily_name ON equipment_types(
	id_equipment_family,
	name
	);

--
-- Table equipments
--
CREATE TABLE equipments(
	id INTEGER NOT NULL auto_increment,
	id_equipment_type INTEGER NOT NULL,
	id_section INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	name VARCHAR(128) NOT NULL,
	description VARCHAR(256),
	notes TEXT,
	reference VARCHAR(32),
	x_pos INTEGER NOT NULL DEFAULT '-1',
	y_pos INTEGER NOT NULL DEFAULT '-1',
	x_size INTEGER NOT NULL DEFAULT '-1',
	y_size INTEGER NOT NULL DEFAULT '-1',
	documents TEXT,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_equipmenttype_name ON equipments(
	id_equipment_type,
	name
	);
CREATE INDEX idx_section_name ON equipments(
	id_section,
	name
	);

--
-- Table article_categories
--
CREATE TABLE article_categories(
	id INTEGER NOT NULL auto_increment,
	id_company INTEGER NOT NULL,
	name VARCHAR(32) NOT NULL,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_company_name ON article_categories(
	id_company,
	name
	);

--
-- Table article_subcategories
--
CREATE TABLE article_subcategories(
	id INTEGER NOT NULL auto_increment,
	id_category INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	name VARCHAR(32) NOT NULL,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_category_name ON article_subcategories(
	id_category,
	name
	);

--
-- Table articles
--
CREATE TABLE articles(
	id INTEGER NOT NULL auto_increment,
	id_article_sub_category INTEGER NOT NULL,
	id_section INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	name VARCHAR(128) NOT NULL,
	description VARCHAR(256),
	localisation VARCHAR(32),
	reference VARCHAR(32),
	stock_quantity TINYINT NOT NULL DEFAULT '0',
	reserved_quantity TINYINT NOT NULL DEFAULT '0',
	order_quantity TINYINT NOT NULL DEFAULT '0',
	minimum_quantity TINYINT NOT NULL DEFAULT '0',
	quantity_to_order TINYINT NOT NULL DEFAULT '0',
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_subcategory_name ON articles(
	id_article_sub_category,
	name
	);
CREATE INDEX idx_idx_section_name ON articles(
	id_section,
	name
	);

--
-- Table components
--
CREATE TABLE components(
	id INTEGER NOT NULL auto_increment,
	id_equipment_family INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	name VARCHAR(32) NOT NULL,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_equipmentfamily_name ON components(
	id_equipment_family,
	name
	);

--
-- Table nomenclatures
--
CREATE TABLE nomenclatures(
	id INTEGER NOT NULL auto_increment,
	id_equipment_type INTEGER NOT NULL,
	id_article INTEGER NOT NULL,
	id_component INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	quantity TINYINT NOT NULL DEFAULT '1',
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_component_article ON nomenclatures(
	id_component,
	id_article
	);
CREATE INDEX idx_idx_equipmenttype ON nomenclatures(
	id_equipment_type
	);
CREATE INDEX idx_idx_component ON nomenclatures(
	id_component
	);
CREATE INDEX idx_idx_article ON nomenclatures(
	id_article
	);

--
-- Table inventories
--
CREATE TABLE inventories(
	id INTEGER NOT NULL auto_increment,
	id_article INTEGER NOT NULL,
	id_user INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	date DATETIME NOT NULL,
	old_quantity TINYINT NOT NULL DEFAULT '0',
	new_quantity TINYINT NOT NULL DEFAULT '0',
	comment TEXT NOT NULL,
	PRIMARY KEY (id)
);


CREATE INDEX idx_idx_article ON inventories(
	id_article
	);
CREATE INDEX idx_idx_user ON inventories(
	id_user
	);

--
-- Table work_orders
--
CREATE TABLE work_orders(
	id INTEGER NOT NULL auto_increment,
	id_equipment INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	status TINYINT NOT NULL,
	description TEXT NOT NULL DEFAULT '',
	notes TEXT,
	maintenance_type TINYINT NOT NULL,
	PRIMARY KEY (id)
);


CREATE INDEX idx_idx_equipment ON work_orders(
	id_equipment
	);

--
-- Table assignation
--
CREATE TABLE assignation(
	id INTEGER NOT NULL auto_increment,
	id_user INTEGER NOT NULL,
	id_work_order INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_user_workorder ON assignation(
	id_user,
	id_work_order
	);
CREATE INDEX idx_idx_user ON assignation(
	id_user
	);
CREATE INDEX idx_idx_workorder ON assignation(
	id_work_order
	);

--
-- Table articles_to_change
--
CREATE TABLE articles_to_change(
	id INTEGER NOT NULL auto_increment,
	id_work_order INTEGER NOT NULL,
	id_article INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	quantity TINYINT NOT NULL DEFAULT '1',
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_workorder_article ON articles_to_change(
	id_work_order,
	id_article
	);
CREATE INDEX idx_idx_workorder ON articles_to_change(
	id_work_order
	);
CREATE INDEX idx_idx_article ON articles_to_change(
	id_article
	);

--
-- Table interventions
--
CREATE TABLE interventions(
	id INTEGER NOT NULL auto_increment,
	id_equipment INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	status TINYINT NOT NULL,
	description TEXT NOT NULL,
	notes TEXT NOT NULL,
	maintenance_type TINYINT NOT NULL,
	start_date DATETIME,
	end_date DATETIME,
	PRIMARY KEY (id)
);


CREATE INDEX idx_idx_equipment ON interventions(
	id_equipment
	);

--
-- Table intervenant
--
CREATE TABLE intervenant(
	id INTEGER NOT NULL auto_increment,
	id_user INTEGER NOT NULL,
	id_intervention INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_user_intervenant ON intervenant(
	id_user,
	id_intervention
	);
CREATE INDEX idx_idx_user ON intervenant(
	id_user
	);
CREATE INDEX idx_idx_intervenant ON intervenant(
	id_user
	);

--
-- Table changed_articles
--
CREATE TABLE changed_articles(
	id INTEGER NOT NULL auto_increment,
	id_intervention INTEGER NOT NULL,
	id_article INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	quantity TINYINT NOT NULL DEFAULT '1',
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_intervention_article ON changed_articles(
	id_intervention,
	id_article
	);
CREATE INDEX idx_idx_intervention ON changed_articles(
	id_intervention
	);
CREATE INDEX idx_idx_article ON changed_articles(
	id_article
	);

--
-- Table suppliers
--
CREATE TABLE suppliers(
	id INTEGER NOT NULL auto_increment,
	id_company INTEGER NOT NULL,
	name VARCHAR(32) NOT NULL,
	website VARCHAR(255),
	address TEXT,
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_company_name ON suppliers(
	id_company,
	name
	);

--
-- Table catalog
--
CREATE TABLE catalog(
	id INTEGER NOT NULL auto_increment,
	id_supplier INTEGER NOT NULL,
	id_article INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	reference VARCHAR(32),
	price DECIMAL(8,2),
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_supplier_article ON catalog(
	id_supplier,
	id_article
	);
CREATE INDEX idx_idx_supplier ON catalog(
	id_supplier
	);
CREATE INDEX idx_idx_article ON catalog(
	id_article
	);

--
-- Table orders
--
CREATE TABLE orders(
	id INTEGER NOT NULL auto_increment,
	id_supplier INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	status TINYINT NOT NULL,
	date DATE NOT NULL,
	price DECIMAL(8,2) NOT NULL,
	reference VARCHAR(32),
	PRIMARY KEY (id)
);


CREATE INDEX idx_idx_supplier_article ON orders(
	id_supplier
	);

--
-- Table order_lines
--
CREATE TABLE order_lines(
	id INTEGER NOT NULL auto_increment,
	id_order INTEGER NOT NULL,
	id_article INTEGER NOT NULL,
	id_company INTEGER NOT NULL,
	price DECIMAL(8,2),
	order_quantity TINYINT NOT NULL DEFAULT '1',
	received_quantity TINYINT NOT NULL DEFAULT '0',
	PRIMARY KEY (id)
);


CREATE UNIQUE INDEX idx_idx_order_article ON order_lines(
	id_order,
	id_article
	);
CREATE INDEX idx_idx_order ON order_lines(
	id_order
	);
CREATE INDEX idx_idx_article ON order_lines(
	id_article
	);


--------------------------------------------------------------------------------
--     Foreign keys                                                           --
--------------------------------------------------------------------------------


ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_offer
	FOREIGN KEY (id_offer)
	REFERENCES offers(id)
	ON DELETE CASCADE;
ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE companies ADD CONSTRAINT fk_companies_manager
	FOREIGN KEY (id_manager)
	REFERENCES users(id)
	ON DELETE CASCADE;
ALTER TABLE users ADD CONSTRAINT fk_users_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE tokens ADD CONSTRAINT fk_tokens_user
	FOREIGN KEY (id_user)
	REFERENCES users(id)
	ON DELETE CASCADE;
ALTER TABLE units ADD CONSTRAINT fk_units_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE sections ADD CONSTRAINT fk_sections_unit
	FOREIGN KEY (id_unit)
	REFERENCES units(id)
	ON DELETE CASCADE;
ALTER TABLE sections ADD CONSTRAINT fk_sections_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE equipment_families ADD CONSTRAINT fk_equipment_families_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE equipment_types ADD CONSTRAINT fk_equipment_types_equipment_family
	FOREIGN KEY (id_equipment_family)
	REFERENCES equipment_families(id)
	ON DELETE CASCADE;
ALTER TABLE equipment_types ADD CONSTRAINT fk_equipment_types_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE equipments ADD CONSTRAINT fk_equipments_equipment_type
	FOREIGN KEY (id_equipment_type)
	REFERENCES equipment_types(id)
	ON DELETE CASCADE;
ALTER TABLE equipments ADD CONSTRAINT fk_equipments_section
	FOREIGN KEY (id_section)
	REFERENCES sections(id)
	ON DELETE CASCADE;
ALTER TABLE equipments ADD CONSTRAINT fk_equipments_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE article_categories ADD CONSTRAINT fk_article_categories_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE article_subcategories ADD CONSTRAINT fk_article_subcategories_category
	FOREIGN KEY (id_category)
	REFERENCES article_categories(id)
	ON DELETE CASCADE;
ALTER TABLE article_subcategories ADD CONSTRAINT fk_article_subcategories_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE articles ADD CONSTRAINT fk_articles_article_sub_category
	FOREIGN KEY (id_article_sub_category)
	REFERENCES article_subcategories(id)
	ON DELETE CASCADE;
ALTER TABLE articles ADD CONSTRAINT fk_articles_section
	FOREIGN KEY (id_section)
	REFERENCES sections(id)
	ON DELETE CASCADE;
ALTER TABLE articles ADD CONSTRAINT fk_articles_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE components ADD CONSTRAINT fk_components_equipment_family
	FOREIGN KEY (id_equipment_family)
	REFERENCES equipment_families(id)
	ON DELETE CASCADE;
ALTER TABLE components ADD CONSTRAINT fk_components_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE nomenclatures ADD CONSTRAINT fk_nomenclatures_equipment_type
	FOREIGN KEY (id_equipment_type)
	REFERENCES equipment_types(id)
	ON DELETE CASCADE;
ALTER TABLE nomenclatures ADD CONSTRAINT fk_nomenclatures_article
	FOREIGN KEY (id_article)
	REFERENCES articles(id)
	ON DELETE CASCADE;
ALTER TABLE nomenclatures ADD CONSTRAINT fk_nomenclatures_component
	FOREIGN KEY (id_component)
	REFERENCES components(id)
	ON DELETE CASCADE;
ALTER TABLE nomenclatures ADD CONSTRAINT fk_nomenclatures_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE inventories ADD CONSTRAINT fk_inventories_article
	FOREIGN KEY (id_article)
	REFERENCES articles(id)
	ON DELETE CASCADE;
ALTER TABLE inventories ADD CONSTRAINT fk_inventories_user
	FOREIGN KEY (id_user)
	REFERENCES users(id)
	ON DELETE CASCADE;
ALTER TABLE inventories ADD CONSTRAINT fk_inventories_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE work_orders ADD CONSTRAINT fk_work_orders_equipment
	FOREIGN KEY (id_equipment)
	REFERENCES equipments(id)
	ON DELETE CASCADE;
ALTER TABLE work_orders ADD CONSTRAINT fk_work_orders_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE assignation ADD CONSTRAINT fk_assignation_user
	FOREIGN KEY (id_user)
	REFERENCES users(id)
	ON DELETE CASCADE;
ALTER TABLE assignation ADD CONSTRAINT fk_assignation_work_order
	FOREIGN KEY (id_work_order)
	REFERENCES work_orders(id)
	ON DELETE CASCADE;
ALTER TABLE assignation ADD CONSTRAINT fk_assignation_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE articles_to_change ADD CONSTRAINT fk_articles_to_change_work_order
	FOREIGN KEY (id_work_order)
	REFERENCES work_orders(id)
	ON DELETE CASCADE;
ALTER TABLE articles_to_change ADD CONSTRAINT fk_articles_to_change_article
	FOREIGN KEY (id_article)
	REFERENCES articles(id)
	ON DELETE CASCADE;
ALTER TABLE articles_to_change ADD CONSTRAINT fk_articles_to_change_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE interventions ADD CONSTRAINT fk_interventions_equipment
	FOREIGN KEY (id_equipment)
	REFERENCES equipments(id)
	ON DELETE CASCADE;
ALTER TABLE interventions ADD CONSTRAINT fk_interventions_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE intervenant ADD CONSTRAINT fk_intervenant_user
	FOREIGN KEY (id_user)
	REFERENCES users(id)
	ON DELETE CASCADE;
ALTER TABLE intervenant ADD CONSTRAINT fk_intervenant_intervention
	FOREIGN KEY (id_intervention)
	REFERENCES interventions(id)
	ON DELETE CASCADE;
ALTER TABLE intervenant ADD CONSTRAINT fk_intervenant_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE changed_articles ADD CONSTRAINT fk_changed_articles_intervention
	FOREIGN KEY (id_intervention)
	REFERENCES interventions(id)
	ON DELETE CASCADE;
ALTER TABLE changed_articles ADD CONSTRAINT fk_changed_articles_article
	FOREIGN KEY (id_article)
	REFERENCES articles(id)
	ON DELETE CASCADE;
ALTER TABLE changed_articles ADD CONSTRAINT fk_changed_articles_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE suppliers ADD CONSTRAINT fk_suppliers_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE catalog ADD CONSTRAINT fk_catalog_supplier
	FOREIGN KEY (id_supplier)
	REFERENCES suppliers(id)
	ON DELETE CASCADE;
ALTER TABLE catalog ADD CONSTRAINT fk_catalog_article
	FOREIGN KEY (id_article)
	REFERENCES articles(id)
	ON DELETE CASCADE;
ALTER TABLE catalog ADD CONSTRAINT fk_catalog_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT fk_orders_supplier
	FOREIGN KEY (id_supplier)
	REFERENCES suppliers(id)
	ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT fk_orders_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;
ALTER TABLE order_lines ADD CONSTRAINT fk_order_lines_order
	FOREIGN KEY (id_order)
	REFERENCES orders(id)
	ON DELETE CASCADE;
ALTER TABLE order_lines ADD CONSTRAINT fk_order_lines_article
	FOREIGN KEY (id_article)
	REFERENCES articles(id)
	ON DELETE CASCADE;
ALTER TABLE order_lines ADD CONSTRAINT fk_order_lines_company
	FOREIGN KEY (id_company)
	REFERENCES companies(id)
	ON DELETE CASCADE;

--- end of sql script
