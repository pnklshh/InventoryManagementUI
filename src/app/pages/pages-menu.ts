import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  {
    title: 'DASHBOARD',
    icon: 'pie-chart-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Database Management',
    icon: 'edit-2-outline',
    children: [
      {
        title: 'Add Item',
        link: '/pages/additem',
      },
      {
        title: 'View Items',
        link: '/pages/viewitems'
      },
      {
        title: 'Add Engineer',
        link: '/pages/addengineer',
      },
      {
        title: 'View Engineers',
        link: '/pages/viewengineers'
      },
      {
        title: 'Add City',
        link: '/pages/addcity'
      },
      {
        title: 'View Cities',
        link: '/pages/viewcities'
      }
    ],
  },
  {
    title: 'Stock Management',
    icon: 'shopping-bag-outline',
    children: [
      {
        title: 'Add Stock',
        link: '/pages/addstock',
      },
      {
        title: 'View Stock',
        link: '/pages/viewstock'
      }
    ],
  },
  {
    title: 'Allocation Management',
    icon: 'shopping-cart-outline',
    children: [
      {
        title: 'Allocate Item',
        link: '/pages/allocateitem',
      },
      {
        title: 'View Allocations',
        link: '/pages/viewallocation',
      }
    ],
  },
  {
    title: 'Report Management',
    icon: 'settings-2-outline',
    children: [
      {
        title: 'Report Usage',
        link: '/pages/reportusage',
      },
      {
        title: 'View History',
        link: '/pages/viewhistory',
      }
    ],
  }
];
