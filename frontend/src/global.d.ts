type ID = string;

interface Book extends BookData {
  id: ID;
}

interface BookData {
  title: string;
}

type Index = Map<ID, Book>;

type APIResult = {
  successful: boolean;
  statusCode: number | void;
  message: string;
};
