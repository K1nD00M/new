SELECT s.*, sc.name as category_name
FROM services s
JOIN service_categories sc ON s.category_id = sc.id; 