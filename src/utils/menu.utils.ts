export const menu = (role: string = 'USER_ROLE') => {

    const menu: any[] = [
        {
            title: 'Dashboard',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Main', url: '/' },
                { title: 'Progress', url: 'progress' },
                { title: 'Graficas', url: 'grafica1' },
                { title: 'Promesas', url: 'promises' },
                { title: 'Rxjs', url: 'rxjs' }
            ]
        },
        {
            title: 'Maintenance',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                { title: 'Hospitals', url: 'hospitals' },
                { title: 'Doctors', url: 'doctors' }
            ]
        }
    ];

    if(role === "ADMIN_ROLE"){
        menu[1].submenu.unshift({ title: 'Users', url: 'users' });
    }

    return menu;
}