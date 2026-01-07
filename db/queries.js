const pool = require('./pool');


// categories
async function getCategories (id) {
    if (!id) {
        const result = await pool.query("SELECT * FROM categories ORDER BY name;")
        return result.rows;
    }

    const result = await pool.query("SELECT * FROM categories WHERE id = $1;", [id]);
    return result.rows[0]

}

async function createCategory (name) {
    const result = await pool.query("INSERT INTO categories (name) VALUES ($1) RETURNING *;", [name]);
    return result.rows[0];
}

async function updateCategory (name, id) {
    const result = await pool.query("UPDATE categories SET name = $1 WHERE id = $2 RETURNING *;", [name, id]);
    return result.rows[0];
}

async function deleteCategory (id) {
    const result = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING *;", [id]);
    return result.rows[0];
}


// phones 
async function getPhones (id) {
    if (!id) {
        const { rows } = await pool.query(`
            SELECT 
                phones.*, 
                categories.name AS category_name 
            FROM phones 
            JOIN categories ON phones.category_id = categories.id
            ORDER BY model_name;
        `);
        return rows;
    }

    const result = await pool.query(`
        SELECT * FROM phones WHERE id = $1;
    `, [id]);
    return result.rows[0];
}

async function getPhonesByCategoryId (category_id) {
    const result = await pool.query(`
        SELECT * FROM phones WHERE category_id = $1 ORDER BY model_name;
    `, [category_id]);
    return result;
}


async function createPhone (category_id, model_name, release_year, price) {
    const result = await pool.query(
        "INSERT INTO phones (category_id, model_name, release_year, price) VALUES ($1, $2, $3, $4) RETURNING *;",
        [category_id, model_name, release_year, price]
    );
    return result.rows[0];
}

async function updatePhone (category_id, model_name, release_year, price, id) {
    const{ rows } = await pool.query(`
        UPDATE phones 
        SET category_id = $1, model_name = $2, release_year = $3, price = $4 
        WHERE id = $5 
        RETURNING *;
    `, [category_id, model_name, release_year, price, id]);
    return rows[0];
}

async function deletePhone (id) {
    const {rows} = await pool.query(`
        DELETE FROM phones 
        WHERE id = $1 
        RETURNING *;
    `, [id]);
    return rows[0];
}



module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,

    getPhones,
    getPhonesByCategoryId,
    createPhone,
    updatePhone,
    deletePhone
}