type ID = string;
interface BookData {
  title: string,
}

type Index = Map<ID, BookData>;

type CreateRequest = {
  id: ID,
  data: BookData,
};

type UpdateRequest = {
  data: BookData,
};

type UpdateResponse = {
  id: ID,
  old: BookData,
  new: BookData,
};
