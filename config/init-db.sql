-- Project {{project.name}} 
-- Database schema version {{project.attributes.database_schema_version}}
-- Database initialization script
{% for object in project.objects %}

CREATE TABLE IF NOT EXISTS {{object.attributes.table_name}}(
	{% for property in object.properties %}
	{%- if property.type.name == 'id' -%}
	{{property.name}} INTEGER NOT NULL auto_increment, 
	{%- endif -%}
	{%- endfor -%}

	{% for property in object.properties %}
	{%- if property.mandatory -%}
	{%-      assign mandatory = "NOT NULL" -%}
	{%- else -%}
	{%-      assign mandatory = "" -%}
	{%- endif -%}
	{%- if property.type.name != 'id' -%}
	{{property.name}} {{property.type.name | upcase }} {{mandatory}}, 
	{%- endif -%}
	{% endfor %}
);
{% endfor %}
