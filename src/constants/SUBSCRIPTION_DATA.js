export const SUBSCRIPTION_DATA = [
  {
    id: 1,
    title: 'باقة الصحة العامة',
    subject: 'الصحة العامة',
    group: 'المجموعة 1',
    status: 'active',
    subscriptionDate: '29 اغسطس 2025',
    expiryDate: '18 سبتمبر 2025',
    icon: 'https://c.animaapp.com/metqva9fL43FZM/img/adobe-express---file-2-2.png',
    actions: {
      secondary: [
        {
          text: 'تغيير المجموعة',
          icon: 'https://c.animaapp.com/metqva9fL43FZM/img/convert-shapes-1.svg'
        },
        {
          text: 'استخدام كوبون لإضافة أيام',
          icon: 'https://c.animaapp.com/metqva9fL43FZM/img/ticket-1.svg'
        }
      ],
      danger: {
        text: 'الغاء الاشتراك',
        icon: 'https://c.animaapp.com/metqva9fL43FZM/img/cross-circle-1.svg'
      }
    }
  },
  {
    id: 2,
    title: 'باقة الصحة العامة',
    subject: 'الصحة العامة',
    status: 'trial',
    subscriptionDate: '29 اغسطس 2025',
    expiryDate: '18 سبتمبر 2025',
    icon: 'https://c.animaapp.com/metqva9fL43FZM/img/adobe-express---file-2-2.png',
    actions: {
      primary: {
        text: 'تمديد الاشتراك',
        icon: 'https://c.animaapp.com/metqva9fL43FZM/img/refresh-1.svg'
      },
      warning: 'انتهت الفترة التجريبية الخاصة بك مدد الاشتراك لمتابعة الاستفادة'
    }
  },
  {
    id: 3,
    title: 'باقة الصحة العامة',
    subject: 'الصحة العامة',
    status: 'expired',
    subscriptionDate: '29 اغسطس 2025',
    expiryDate: '18 سبتمبر 2025',
    icon: 'https://c.animaapp.com/metqva9fL43FZM/img/adobe-express---file-2-2.png',
    actions: {
      primary: {
        text: 'تجديد الاشتراك',
        icon: 'https://c.animaapp.com/metqva9fL43FZM/img/refresh-1.svg'
      },
      warning: 'انتهت صلاحية باقتك، اضغط على زر (تجديد الباقة) لتجديدها ومتابعة استخدام خدماتنا'
    }
  },
  {
    id: 4,
    title: 'باقة تأسيس اللغة الإنجليزية (المستوي الأول)',
    subject: 'اللغة الانجليزية',
    status: 'cancelled',
    subscriptionDate: '29 اغسطس 2025',
    expiryDate: '18 سبتمبر 2025',
    icon: 'https://c.animaapp.com/metqva9fL43FZM/img/adobe-express---file--1--1.png',
    actions: {
      primary: {
        text: 'طلب إعادة تفعيل الاشتراك',
        icon: 'https://c.animaapp.com/metqva9fL43FZM/img/refresh-1.svg'
      },
      warning: 'لقد قمت بتغيير الاشتراك لإعادة التفعيل أرسل طلب عبر الضغط علي زر إعادة تفعيل الاشتراك'
    }
  }
];
