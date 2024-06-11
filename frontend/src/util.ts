export const emptyBookData: BookData = {
  title: '',
  obtained: null,
  finished: null,
  memo_link: null,
};

export const isValidDate = (d: Date): boolean => !isNaN(d.getTime());
