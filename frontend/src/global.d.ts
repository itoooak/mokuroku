type ID = string;

interface APIResp extends Book {
  readonly obtained: string?;
  readonly finished: string?;
}

interface Book extends BookData {
  readonly id: ID;
}

interface BookData {
  readonly title: string;
  readonly obtained: Date?;
  readonly finished: Date?;
  readonly memo_link: string?;
}

type Index = Map<ID, Book>;

type APIResult = {
  successful: boolean;
  statusCode: number | void;
  message: string;
};
