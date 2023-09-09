type ID = string;
interface BookData {
  title: string,
}

type Index = Map<ID, BookData>;

type UpsertRequest = {
  id: ID,
  data: BookData,
};

type UpsertResponse = UpdateResponse | CreateResponse;

type UpdateResponse = {
  id: ID,
  old: BookData,
  new: BookData,
};

type CreateResponse = {
  id: ID,
  new: BookData,
};

type DeleteRequest = {
  id: ID,
};
