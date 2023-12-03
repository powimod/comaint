-- Project {{project.name}} 
-- Database schema version {{project.attributes.database_schema_version}}
-- MySQL Database initialization script

-- CREATE SCHEMA db_comaint;
USE {{project.attributes.database_name}}
-- CREATE USER 'comaint'@'localhost' IDENTIFIED BY 'g4m0-KauM1nt';
-- GRANT ALL PRIVILEGES ON db_comaint.* TO 'comaint'@'localhost';


--------------------------------------------------------------------------------
--     Tables                                                                 --
--------------------------------------------------------------------------------

{% for object in project.objects %}
--
-- Table {{object.attributes.table_name}}
--
CREATE TABLE {{object.attributes.table_name}}(
	{% for property in object.properties %}
		{%- if property.type.name == 'id' -%}
			{{property.name}} INTEGER NOT NULL auto_increment, 
		{%- endif -%}
	{%- endfor -%}

	{% for link in object.links %}
	id{{link.name | capitalize}} INTEGER NOT NULL, 
	{%- endfor -%}


	{% for property in object.properties %}
		{%- liquid
		    if property.maximum
			assign data_size = property.maximum
		    else
			assign data_size = 255
		    endif 
		    if property.mandatory
			 assign mandatory = " NOT NULL"
		    else
			 assign mandatory = ""
		    endif 
		   case property.type.name
		      when "string"
			 assign data_type = data_size | prepend: "VARCHAR(" | append: ")"
		      when "text"
			 assign data_type = "TEXT"
		      when "integer"
			 assign data_type = "INTEGER"
		      else
			 assign data_type = "???"
		   endcase
		   if property.defaultValue 
		         assign default_value = property.defaultValue | prepend: " DEFAULT '" | append: "'"
		   else
		         assign default_value = ""
	           endif -%}
		{%- if property.type.name != 'id' -%}
			{{property.name}} {{data_type}}{{mandatory}}{{default_value}}, 
		{%- endif %}
	{% endfor -%}

	{% for property in object.properties %}
		{%- if property.type.name == 'id' -%}
			PRIMARY KEY ({{property.name}})
		{%- endif -%}
	{%- endfor %}
);

{% for index in object.indexes%}
{% liquid
   if index.unique
	assign unicity = "UNIQUE "
   else
	assign unicity = ""
   endif -%}
CREATE {{unicity}}INDEX idx_{{index.name}} ON {{object.attributes.table_name}}(
	{% for key in index.keys -%}
	{%- liquid
	  case key.type
	     when "property"
	        assign key_target = key.reference.name
	     when "link"
	        assign key_target = key.reference.name | capitalize | prepend: "id" 
	  else
	        assign key_target = "???"
	  endcase
	  if key.last
		assign separator = ''
	  else
		assign separator = ','
	  endif -%}
	{{key_target}}{{separator}}
	{% endfor -%}
);
{%- endfor %}
{% endfor %}

--------------------------------------------------------------------------------
--     Foreign keys                                                           --
--------------------------------------------------------------------------------

{% for object in project.objects -%}
{%- for link in object.links %}
{%- assign target_table = link.target.attributes.table_name %}
ALTER TABLE {{object.attributes.table_name}} ADD CONSTRAINT fk_{{object.attributes.table_name}}_{{link.name}}
	FOREIGN KEY (id{{link.name | capitalize}})
	REFERENCES {{target_table}}(id);

{%- endfor -%}
{%- endfor %}

--- end of sql script
