import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b pt-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        {/* <div className="bg-orangedeep text-white p-6">
          <h1 className="text-3xl font-bold text-center">سياسة الخصوصية</h1>
          <p className="text-center mt-2 text-orange-100">منصة الدلفين التعليمية</p>
        </div> */}

        {/* Content */}
        <div className="p-6 md:p-8 text-gray-800 leading-relaxed">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orangedeep mb-4">
              مقدمة
            </h2>
            <p className="mb-4">
              مرحبًا بكم في منصة الدلفين التعليمية، منصة تعليمية مخصصة للأطفال
              تحت سن 18 عامًا. نحن ملتزمون بحماية خصوصية الأطفال ومراعاة أمانهم
              على الإنترنت. تم إعداد هذه السياسة لتوضيح كيفية جمع واستخدام
              ومشاركة المعلومات الشخصية للأطفال ومستخدمي المنصة الآخرين.
            </p>
          </section>

          {/* Information Collection */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orangedeep mb-4">
              1. المعلومات التي نقوم بجمعها
            </h2>
            <p className="mb-4">نحن نجمع نوعين من المعلومات:</p>
            <ul className="list-disc pr-6 mb-4 space-y-2">
              <li className="mr-4">
                <span className="font-medium">المعلومات الشخصية:</span> وتشمل
                الاسم، البريد الإلكتروني، ومعلومات الاتصال الأخرى التي يتم
                توفيرها عند التسجيل.
              </li>
              <li className="mr-4">
                <span className="font-medium">المعلومات غير الشخصية:</span> مثل
                نشاط المستخدم على المنصة، تفضيلات التعلم، واستخدام الخصائص
                المختلفة على الموقع.
              </li>
            </ul>
          </section>

          {/* Information Usage */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orangedeep mb-4">
              2. كيفية استخدام المعلومات
            </h2>
            <p className="mb-4">
              نستخدم المعلومات التي نجمعها لتحقيق الأغراض التالية:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li className="mr-4">
                <span className="font-medium">تقديم خدمات تعليمية:</span> توفير
                المحتوى التعليمي والتفاعلي الذي يناسب مستوى الطفل.
              </li>
              <li className="mr-4">
                <span className="font-medium">تحسين المنصة:</span> فهم كيفية
                استخدام الأطفال والمستخدمين الآخرين للمنصة وتحديد المجالات التي
                تحتاج إلى تطوير.
              </li>
              <li className="mr-4">
                <span className="font-medium">التواصل:</span> إرسال تحديثات
                دورية حول الدروس، الأنشطة التعليمية، أو التغييرات في سياسة
                الخصوصية.
              </li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orangedeep mb-4">
              3. مشاركة المعلومات
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-orangedeep mb-1">
                  مع أطراف ثالثة:
                </h3>
                <p>
                  لا نقوم بمشاركة المعلومات الشخصية مع أطراف ثالث إلا في حالة
                  الضرورة لتقديم الخدمات المطلوبة أو بناءً على موافقة الوالدين
                  أو الأوصياء.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-orangedeep mb-1">
                  الإفصاح القانوني:
                </h3>
                <p>
                  قد نقوم بالإفصاح عن المعلومات إذا كان ذلك مطلوبًا بموجب
                  القانون أو لحماية حقوقنا القانونية.
                </p>
              </div>
            </div>
          </section>

          {/* Information Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orangedeep mb-4">
              4. أمان المعلومات
            </h2>
            <p>
              نتبع معايير أمان صارمة لحماية المعلومات الشخصية من الوصول غير
              المصرح به، التعديل، أو الإفصاح. نقوم بتشفير المعلومات الحساسة
              ونستخدم بروتوكولات أمان متقدمة.
            </p>
          </section>

          {/* Parental Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orangedeep mb-4">
              5. حقوق الوالدين أو الأوصياء
            </h2>
            <p className="mb-4">يحق للوالدين أو الأوصياء:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li className="mr-4">
                <span className="font-medium">الوصول إلى المعلومات:</span> طلب
                نسخة من المعلومات الشخصية التي تم جمعها عن الطفل.
              </li>
              <li className="mr-4">
                <span className="font-medium">تصحيح المعلومات:</span> طلب تعديل
                أي معلومات غير دقيقة أو قديمة.
              </li>
              <li className="mr-4">
                <span className="font-medium">حذف المعلومات:</span> طلب حذف أي
                معلومات تم جمعها عن الطفل، وذلك ضمن الحدود التي يتيحها القانون.
              </li>
            </ul>
          </section>

          {/* Policy Changes */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orangedeep mb-4">
              6. التغييرات في سياسة الخصوصية
            </h2>
            <p>
              قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم إبلاغ الوالدين أو
              الأوصياء بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على
              المنصة.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-orangedeep mb-4">
              7. التواصل معنا
            </h2>
            <p>
              إذا كان لديك أي استفسارات أو مخاوف حول سياسة الخصوصية أو كيفية
              التعامل مع معلومات طفلك، يرجى الاتصال بنا.
            </p>
          </section>

          {/* Effective Date */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            {/* <p className="text-center font-medium text-orangedeep">
              تاريخ السريان: [20/08/2024]
            </p> */}
            <p className="text-center mt-2 text-gray-700">
              بتسجيلك في "الدلفين لتعليم الأطفال"، فإنك توافق على سياسة الخصوصية
              هذه وتؤكد أنك ولي أمر أو وصي على الطفل المستخدم للمنصة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
