USE db_comaint;

DROP TABLE IF EXISTS order_lines;
DROP TABLE IF EXISTS orders;

DROP TABLE IF EXISTS inventories;

DROP TABLE IF EXISTS articles_to_change;
DROP TABLE IF EXISTS assignation;
DROP TABLE IF EXISTS work_orders;

DROP TABLE IF EXISTS changed_articles;
DROP TABLE IF EXISTS intervenant;
DROP TABLE IF EXISTS interventions;

DROP TABLE IF EXISTS catalog;
DROP TABLE IF EXISTS suppliers;

DROP TABLE IF EXISTS nomenclatures;
DROP TABLE IF EXISTS components;

DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS article_subcategories;
DROP TABLE IF EXISTS article_categories;

DROP TABLE IF EXISTS equipments;
DROP TABLE IF EXISTS equipment_types;
DROP TABLE IF EXISTS equipment_families;

DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS units;

DROP TABLE IF EXISTS subscriptions;

DROP TABLE IF EXISTS tokens;

DROP TABLE IF EXISTS offers;

DELETE FROM companies;
DELETE FROM users;

ALTER TABLE companies DROP CONSTRAINT fk_companies_manager;
ALTER TABLE users DROP CONSTRAINT fk_users_company;

DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;
