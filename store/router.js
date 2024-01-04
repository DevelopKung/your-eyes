const url = process.env.NODE_ENV == 'development' ? `${process.env.URL_CLIENT_DEV}/api/` : `${process.env.URL_API}/`;
export default {
  me: {
    menu: url + 'menu',
  },
  register: url + 'register', 
  lists: {
    lists: url + 'lists',
    info: url + 'lists/{:id}',
    update: url + 'lists/{:id}',
    create: url + 'lists',
    delete: url + 'lists/d/{:id}',
  }, 
  booking: {
    lists: url + 'booking',
    info: url + 'booking/{:id}',
    update: url + 'booking/{:id}',
    create: url + 'booking',
    delete: url + 'booking/d/{:id}',
  },
  service: {
    discount: url + 'service/discount',
    calendar: url + 'service/calendar',
  },
  expenses: {
    lists: url + 'expenses',
    info: url + 'expenses/{:id}',
    update: url + 'expenses/{:id}',
    create: url + 'expenses',
    delete: url + 'expenses/d/{:id}',
  }
}