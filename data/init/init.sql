CREATE TABLE Books (
    id VARCHAR,
    title VARCHAR,
    obtained TIMESTAMPTZ,
    finished TIMESTAMPTZ,
    PRIMARY KEY (id)
);

INSERT INTO Books(id, title)
VALUES
    ('bookA', '本A'),
    ('bookB', '本B');
