# نظام معالجة الأخطاء وعرضها

## 🎯 الهدف

بدلاً من ظهور **شاشة بيضاء** عند حدوث خطأ، يتم عرض:
- ✅ رسالة خطأ واضحة بالعربية/الإنجليزية
- ✅ تفاصيل الخطأ قابلة للعرض
- ✅ زر لنسخ تفاصيل الخطأ
- ✅ زر لإعادة تحميل الصفحة
- ✅ معلومات المتصفح والجهاز

## 📦 المكونات

### 1. Error Boundary Component

**الملف:** `src/components/ErrorBoundary.jsx`

**الوظائف:**
- يلتقط جميع أخطاء React (Component errors)
- يعرض واجهة مستخدم جميلة عند حدوث خطأ
- يسمح بنسخ تفاصيل الخطأ
- يوفر زر لإعادة التحميل

**الميزات:**
```javascript
// يلتقط أخطاء مثل:
- Component rendering errors
- Lifecycle method errors
- Constructor errors
- Event handler errors (في بعض الحالات)
```

### 2. Global Error Handlers

**الملف:** `src/main.jsx`

**الوظائف:**

#### A. window.addEventListener('error')
يلتقط:
- أخطاء JavaScript العامة
- أخطاء تحميل الموارد (scripts, images, etc.)
- Syntax errors
- أخطاء خارج React components

#### B. window.addEventListener('unhandledrejection')
يلتقط:
- Promise rejections غير المعالجة
- async/await errors غير المعالجة
- أخطاء Service Worker
- أخطاء API calls

## 🎨 واجهة عرض الخطأ

### التصميم

```
┌─────────────────────────────────┐
│      🔴 (أيقونة خطأ دائرية)      │
│                                 │
│  عذراً، حدث خطأ غير متوقع      │
│                                 │
│  نعتذر عن الإزعاج...           │
│                                 │
│  ▼ عرض تفاصيل الخطأ (قابلة للفتح)│
│  [  تفاصيل الخطأ هنا...  ]     │
│                                 │
│  [🔄 إعادة تحميل]  [📋 نسخ]    │
│                                 │
│  للمساعدة، تواصل مع الدعم...   │
└─────────────────────────────────┘
```

### الألوان
- **خلفية:** `#f8f9fa` (رمادي فاتح)
- **Card:** `white` مع `box-shadow`
- **أيقونة الخطأ:** `#dc3545` (أحمر)
- **زر إعادة التحميل:** `#0c2d40` (أزرق داكن)
- **زر النسخ:** `#6c757d` (رمادي) → `#28a745` (أخضر) عند النسخ

## 🔧 كيفية الاستخدام

### 1. في التطبيق الرئيسي

```jsx
// src/main.jsx
import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
```

### 2. في مكونات محددة (اختياري)

```jsx
import ErrorBoundary from "@/components/ErrorBoundary";

function MyComponent() {
  return (
    <ErrorBoundary>
      <SomeRiskyComponent />
    </ErrorBoundary>
  );
}
```

## 📋 ما يتم نسخه عند الضغط على "نسخ"

```
التطبيق: منصة الدلفين التعليمية
المتصفح: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...
التاريخ: ٢٠٢٥/٠١/١٥ ١٠:٣٠:٤٥

الخطأ:
TypeError: Cannot read property 'map' of undefined

تفاصيل الخطأ:
TypeError: Cannot read property 'map' of undefined
    at SessionList (sessions.jsx:45)
    at div
    at App (App.jsx:12)
    ...

معلومات إضافية:
    in SessionList (at sessions.jsx:45)
    in div (at App.jsx:20)
    in App
```

## 🧪 اختبار Error Boundary

### طريقة 1: محاكاة خطأ في Component

أضف هذا الكود في أي component:

```jsx
function TestError() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('هذا خطأ اختباري!');
  }

  return (
    <button onClick={() => setShouldError(true)}>
      اختبر Error Boundary
    </button>
  );
}
```

### طريقة 2: محاكاة خطأ Promise

```jsx
function TestPromiseError() {
  const causeError = () => {
    Promise.reject(new Error('خطأ Promise غير معالج!'));
  };

  return (
    <button onClick={causeError}>
      اختبر Promise Error
    </button>
  );
}
```

### طريقة 3: من Console

افتح Console في المتصفح:

```javascript
// اختبار global error
throw new Error('Test Error from Console');

// اختبار unhandled rejection
Promise.reject(new Error('Test Promise Rejection'));

// عرض قائمة الأخطاء المخزنة
console.log(window.__ERROR_QUEUE__);
```

## 📊 معالجة أنواع الأخطاء المختلفة

### 1. Component Errors
✅ **يعالجها:** Error Boundary
```jsx
// خطأ في render
function BrokenComponent() {
  return <div>{undefined.property}</div>; // Error!
}
```

### 2. Event Handler Errors
⚠️ **لا يعالجها Error Boundary مباشرة**

**الحل:** استخدم try-catch

```jsx
function SafeButton() {
  const handleClick = () => {
    try {
      // كود قد يسبب خطأ
      riskyOperation();
    } catch (error) {
      console.error('Button error:', error);
      // أو اعرض toast/notification
    }
  };

  return <button onClick={handleClick}>اضغط</button>;
}
```

### 3. Async/Await Errors
✅ **يعالجها:** Global unhandledrejection handler

```jsx
async function fetchData() {
  // إذا فشل fetch ولم يُعالج، سيلتقطه unhandledrejection
  const response = await fetch('/api/data');
  return response.json();
}
```

**الأفضل:** معالجة محلية

```jsx
async function fetchDataSafe() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    // اعرض رسالة للمستخدم
    return null;
  }
}
```

### 4. Service Worker Errors
✅ **يعالجها:** Global error handlers + try-catch في registerSW

```javascript
try {
  updateSW = registerSW({
    onRegisterError(error) {
      console.error('SW error:', error);
    }
  });
} catch (error) {
  console.error('SW registration failed:', error);
}
```

## 🎯 أفضل الممارسات

### 1. استخدم Error Boundary في المستويات المهمة

```jsx
<ErrorBoundary>
  <Router>
    <ErrorBoundary>
      <CriticalFeature />
    </ErrorBoundary>
    <OtherFeature />
  </Router>
</ErrorBoundary>
```

### 2. أضف معلومات سياقية للأخطاء

```jsx
class ErrorBoundaryWithContext extends ErrorBoundary {
  componentDidCatch(error, errorInfo) {
    // أضف معلومات إضافية
    const enhancedError = {
      ...error,
      userId: getCurrentUserId(),
      route: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    super.componentDidCatch(enhancedError, errorInfo);
  }
}
```

### 3. سجل الأخطاء في خدمة خارجية (اختياري)

```javascript
// في componentDidCatch
componentDidCatch(error, errorInfo) {
  // أرسل إلى Sentry, LogRocket, etc.
  logErrorToService({
    error: error.toString(),
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    userAgent: navigator.userAgent,
    url: window.location.href
  });
}
```

## 🐛 استكشاف الأخطاء

### المشكلة: Error Boundary لا يلتقط الخطأ

**الأسباب المحتملة:**
1. الخطأ في event handler → استخدم try-catch
2. الخطأ في async code → استخدم try-catch أو .catch()
3. الخطأ خارج React → سيلتقطه global error handler

### المشكلة: زر "نسخ" لا يعمل على iOS

**الحل:** الكود يتضمن fallback لمتصفحات قديمة:
```javascript
// يستخدم navigator.clipboard أولاً
// ثم يعود إلى document.execCommand('copy')
```

### المشكلة: الخطأ يظهر بالإنجليزية فقط

**الحل:** تحقق من `document.documentElement.dir`:
```javascript
const isRTL = document.documentElement.dir === 'rtl';
```

تأكد من أن `<html dir="rtl">` موجود في `index.html`.

## 📱 التوافق مع iOS

### التحسينات الخاصة بـ iOS:

1. **Responsive Design**
   ```javascript
   flexDirection: window.innerWidth < 640 ? 'column' : 'row'
   ```

2. **Fallback للنسخ**
   ```javascript
   // clipboard API + execCommand fallback
   ```

3. **منع الأخطاء المتكررة**
   ```javascript
   event.preventDefault(); // في unhandledrejection
   ```

4. **معالجة Service Worker errors**
   ```javascript
   try-catch حول registerSW()
   ```

## 🎨 التخصيص

### تغيير الألوان

في `ErrorBoundary.jsx`:

```javascript
// الألوان الحالية
const colors = {
  primary: '#0c2d40',      // أزرق داكن
  danger: '#dc3545',       // أحمر
  success: '#28a745',      // أخضر
  secondary: '#6c757d',    // رمادي
  background: '#f8f9fa'    // رمادي فاتح
};
```

### إضافة شعار

```jsx
{/* في بداية العرض */}
<img
  src="/homeChild.png"
  alt="Logo"
  style={{ width: '60px', marginBottom: '20px' }}
/>
```

### إضافة زر للدعم الفني

```jsx
<a
  href="https://chat.learnadolphin.com"
  style={{
    display: 'block',
    marginTop: '15px',
    color: '#0c2d40',
    textDecoration: 'none',
  }}
>
  💬 تواصل مع الدعم الفني
</a>
```

## 📈 المراقبة والتحليل

### جمع إحصائيات الأخطاء

```javascript
// في main.jsx
const errorStats = {
  totalErrors: 0,
  errorsByType: {},
  errorsByPage: {}
};

window.addEventListener('error', (event) => {
  errorStats.totalErrors++;
  errorStats.errorsByType[event.error?.name] =
    (errorStats.errorsByType[event.error?.name] || 0) + 1;
  errorStats.errorsByPage[window.location.pathname] =
    (errorStats.errorsByPage[window.location.pathname] || 0) + 1;
});

// عرض الإحصائيات
console.log('Error Stats:', errorStats);
```

## ✅ الخلاصة

### ما تم تنفيذه:

1. ✅ **Error Boundary Component** - يلتقط أخطاء React
2. ✅ **Global Error Handler** - يلتقط أخطاء JavaScript
3. ✅ **Unhandled Rejection Handler** - يلتقط أخطاء Promises
4. ✅ **واجهة عرض جميلة** - بدلاً من الشاشة البيضاء
5. ✅ **نسخ تفاصيل الخطأ** - للمساعدة في التشخيص
6. ✅ **إعادة تحميل سهلة** - بزر واحد
7. ✅ **دعم RTL/LTR** - للعربية والإنجليزية
8. ✅ **توافق iOS** - مع fallbacks

### النتيجة:

**لن تظهر شاشة بيضاء مرة أخرى! 🎉**

بدلاً من ذلك، سيرى المستخدم:
- رسالة خطأ واضحة
- خيارات لحل المشكلة
- معلومات مفيدة للدعم الفني

---

**آخر تحديث:** يناير 2025
**الحالة:** ✅ جاهز للاستخدام
