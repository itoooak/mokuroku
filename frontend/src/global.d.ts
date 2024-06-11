type ID = string;

interface Book extends BookData {
  readonly id: ID;
}

interface BookData {
  title: string;
  obtained: Date?;
  finished: Date?;
  memo_link: string?;
}

type Index = Map<ID, Book>;

type APIResult = {
  successful: boolean;
  statusCode: number | void;
  message: string;
};
