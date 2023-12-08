const url = process.env.URL_CLIENT + '/api/';
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
    delete: url + 'lists/{:id}',
  }, 
  booking: {
    lists: url + 'booking',
    info: url + 'booking/{:id}',
    update: url + 'booking/{:id}',
    create: url + 'booking',
    delete: url + 'booking/{:id}',
  },
  service: {
    discount: url + 'service/discount',
    calendar: url + 'service/calendar',
  },
}