CREATE TABLE IF NOT EXISTS "Room" (
    id SERIAL PRIMARY KEY,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    room_owner_id INT NOT NULL,
    CONSTRAINT fk_room_owner FOREIGN KEY (room_owner_id) REFERENCES "User"(id) ON DELETE CASCADE
);
