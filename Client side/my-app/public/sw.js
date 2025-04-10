self.addEventListener('push', (event) => {
    const data = event.data.json();
    const title = data.title;
    const icon = data.icon;
    const body = data.body;

    const notificationsOptions = {
        body: body,
        tag: 'unique-tag',
        icon: icon,
        url: 'http://localhost:8000/bookings'
    }
    self.registration.showNotification(title, notificationsOptions)

})