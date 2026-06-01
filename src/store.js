export const initialStore = () => {
  return {
    contacts: [],
    loading: false,
    error: null,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_contacts":
      return { ...store, contacts: action.payload };

    case "add_contact":
      return { ...store, contacts: [...store.contacts, action.payload] };

    case "update_contact":
      return {
        ...store,
        contacts: store.contacts.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    case "delete_contact":
      return {
        ...store,
        contacts: store.contacts.filter((c) => c.id !== action.payload),
      };

    case "set_loading":
      return { ...store, loading: action.payload };

    case "set_error":
      return { ...store, error: action.payload };

    default:
      return store;
  }
}