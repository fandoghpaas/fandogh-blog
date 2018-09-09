# Zero Downtime Deployment

در این پست به تشریح فرایند استقرار نسخه‌های جدید یک سرویس بر روی فندق می‌پردازیم. این مطالب به شما کمک خواهد کرد تا با مفهوم Zero Downtime Deployment بیشتر آشنا شوید. همچنین برای اینکه فندق بتواند این نوع استقرار را به درستی انجام  دهد تنظیماتی از جانب کاربران مورد نیاز است که در این پست به تشریح آنها نیز خواهیم پرداخت.

##  چرایی Zero Downtime Deployment

یکی از مشکلاتی که در حین استقرار سرویس‌ها و وب‌ سایت‌ها ممکن است اتفاق بیفتد در دسترس نبودن سرویس برای مدتی نامعلوم است که می‌تواند منجر به از دست دادن مشتری‌ها و یا نارضایتی آنها شود.

تفاوتی ندارد که شما به صورت انفرادی در حال توسعه محصولی کوچک هستید و یا در تیمی بزرگ بر روی محصولی سازمانی کار می‌کنید. همیشه بخشی از زمان شما و یا تیم شما برای استقرار و نگهداری سرویس‌هایتان خرج می‌شود.
 
اگر این کار به صورت دستی انجام شود بخش قابل ملاحظه‌ای از زمان خود را به خود اختصاص می‌دهد و همینطور در هر یک از مراحل استقرار امکان اشتباه انسانی وجود دارد که ممکن است منجر به قطع شدن سرویس شما برای مدتی بیش از حد پیش بینی شما شود. 


## فندق و Zero Downtime Deployment

در فندق تمام مراحل استقرار نسخه جدید سرویس به صورت خودکار صورت می‌گیرد و کاربر تنها نیاز به مانیتور استقرار دارد تا  مطمئن شود  که نسخه جدید بدون مشکل مستقر شده است.

::: warning توجه
 حتی در صورت وجود مشکل در نسخه جدید سرویس شما از دسترس خارج نخواهد شد و نسخه قبلی سرویس شما به کاربران سرویس خواهد داد. 
:::

برای اینکه فندق بتواند به صورت خودکار و بدون downtime استقرار نسخه جدید را انجام دهد نیاز به روشی برای تست سلامت سرویس شما خواهد داشت (healthcheck). با استفاده از این تست فندق قبل از خارج کردن نسخه قبلی سرویس شما می‌تواند مطمئن شود که نسخه جدید به درستی و بدون مشکل مستقر شده و آماده دسترسی به درخواست کاربران و یا دیگر سرویس‌ها است. 

در ادامه به صورت قدم به قدم به همراه مثال مراحل لازم برای ایجاد یک سرویس با قابلیت تست سلامت و نحوه عملکرد فندق را شرح خواهیم داد.


کدهای استفاده شده در این پست را می‌توانید از
[‌اینجا](
https://github.com/fandoghpaas/fandogh-examples/tree/master/zero-downtime
)
مشاهده و دانلود کنید.


## مطالعه موردی

در این مثال فرض بر این است که نسخه اول یک وب اپلیکیشن که دارای دو replica است در حال حاضر روی فندق مستقر شده است و ما قصد داریم نسخه ۱.۱ این وب اپلیکیشن را بدون از دسترس خارج شدن بر روی فندق مستقر کنیم. 

کد مربوط به نسخه اول را در 
[اینجا](
https://github.com/fandoghpaas/fandogh-examples/tree/master/zero-downtime/v1
)
می‌توانید مشاهده کنید.



::: warning توجه
توجه داشته باشید که امکان replica تنها برای پلن‌های غیر رایگان فندق قابل استفاده است. اگر کاربر پلن رایگان فندق هستید ‌شما همچنان قادر به استقرار بدون down time ولی با یک replica هستید.
:::


پس از اینکه image پروژه را بر روی فندق منتشر نمودید با استفاده از این مانیفست می‌توانید سرویس نسخه اول را مستقر نمایید.

‍
```yaml
kind: ExternalService
name: zero-downtime
spec:
  image: zero-downtime:v1.0
  port: 8080
  replicas: 2
  readiness_probe:
    http_get:
      path: /
      port: 8080
    initial_delay_seconds: 10
    period_seconds: 5

```


شما می‌توانید این فایل را از 
[اینجا](
https://github.com/fandoghpaas/fandogh-examples/blob/master/zero-downtime/service-manifest.yml
)
دانلود نمایید.



اگر با مانیفست‌ها در فندق آشنایی ندارید می‌توانید جزییات و نحوه استفاده از آنها در فندق را در
[اینجا](
https://docs.fandogh.cloud/docs/service-manifest.html
)
مطالعه کنید.

پس از ایجاد فایل مانیفست با استفاده از دستور زیر می‌توانید سرویس را بر روی فندق مستقر نمایید.

```bash
fandogh service apply -f service-manifest.yml
```

خروجی این دستور URL  هایی خواهد بود که وب سایت شما از طریق آنها قابل دسترسی است.

تا به اینجای کار دیاگرام کلی سرویس شما بر روی فندق، به شکل زیر خواهد بود. البته توجه داشته باشید که بخش زیاد از جزییات که مرتبط با موضوع این پست نبوده‌اند از این دیاگرام حذف شده‌اند. 


![Zero Downtime Deployment step 1](/articles/zero-downtime1.png "Zero Downtime Deployment step 1")  

همانطور که در تصویر نیز مشاهده می‌کنید در مقابل replica های سرویس مستقر شده بر روی فندق یک load balancer داخلی اختصاصی ایجاد شده که وظیفه‌اش پخش درخواست‌ها به replica های آماده به پاسخگویی است. 


### استقرار نسخه جدید سرویس

در این مرحله قصد داریم نسخه جدید سرویس را بر روی فندق مستقر کنیم. کد مربوط به این نسخه را می‌توانید
[اینحا](
https://github.com/fandoghpaas/fandogh-examples/tree/master/zero-downtime/v1.1
)
مشاهده نمایید.



بعد از اینکه این نسخه از ایمیج را منتشر کردید با استفاده از این مانیفست میتونید نسخه جدید سرویس را منتشر کنید:

```yaml
kind: ExternalService
name: zero-downtime
spec:
  image: zero-downtime:v1.1
  port: 8080
  replicas: 2
  readiness_probe:
    http_get:
      path: /
      port: 8080
    initial_delay_seconds: 10
    period_seconds: 5
```

بعد از apply کردن این مراحل بر روی فندق اتفاق خواهد افتاد

### ایجاد یک replica از سرویس

همانطور که در دیاگرام زیر نیز مشاهده می‌کنید در این مرحله یک replica با نسخه جدید ایمیج شما بر روی فندق ایجاد خواهد شد. در این مرحله هنوز ترافیکی توسط load balancer به این سرویس ارسال نمی‌شود و تنها تست آمادگی سرویس جدید فراخوانی می‌شود. مادامی که تست آمادگی این replica که فراخوانی یک http endpoint است چیزی به غیر از http code ۲۰۰ باشد سرویس در این وضعیت می‌ماند.

![Zero Downtime Deployment step 2](/articles/zero-downtime2.png "Zero Downtime Deployment step 2")


### پاسخ مثبت به تست آمادگی

پس از اینکه فراخوانی تست آمادگی پاسخ دریافت کرد این نسخه از replica شروع به دریافت ترافیک از load balancer خواهد کرد. همچنین در این لحظه به دلیل اینکه تعداد replica های سرویس شما بیش از تعدادی است که در مانیفست توصیف کرده اید فرایند حذف یکی از نسخه‌های قدیمی سرویس شما از فندق آغاز می‌گردد. 

فرایند حذف شامل این مراحل است:

* لود بالانسر درخواست جدید به این replica ارسال نمی‌کند
* لود بالانسر صبر می‌کند تا تمام درخواست‌های ارسال شده به سرویس پاسخ داده شده و یا timeout شوند
* بعد از این دو مرحله replica حذف شده و منابع اختصاص داده شده به آن آزاد می‌شوند

![Zero Downtime Deployment step 3](/articles/zero-downtime3.png "Zero Downtime Deployment step 3")


### تکرار مراحل فوق تا به روز شدن تمام replica ها

مراحلی که در بالا تشریح شدند دوباره تکرار خواهند شد تا تمام replica های سرویس مورد نظر به روز شوند. 
در دیاگرام‌هایی که در ادامه آمده اند این مراحل ترسیم شده‌اند.


![Zero Downtime Deployment step 4](/articles/zero-downtime4.png "Zero Downtime Deployment step 4")

پس از اینکه replica با نسخه جدید آماده شد لودبالانسر شروع بر ارسال بخشی از ترافیک به این replica می‌کنید و به طور همزمان فرایند مورد نیاز برای حذف replica با نسخه قبلی آغاز می‌شود.

![Zero Downtime Deployment step 5](/articles/zero-downtime5.png "Zero Downtime Deployment step 5")

بعد از اینکه تمام درخواست‌هایی که به replica قدیمی پاسخ داده شده‌اند این replica حذف شده و منابع اختصاص داده شده به آن آزاد می‌شود

![Zero Downtime Deployment step 6](/articles/zero-downtime6.png "Zero Downtime Deployment step 6")


## چند نکته

سعی کنید تا جای ممکن با دستورات CLI فندق آشنا بشید. این دستورات دوستان شما هستند و می‌توانند کمک زیادی به شما کنند.

برای مثال با استفاده از این دستور در حین استقرار replica جدید می‌توانید اطلاعات ارزشمندی در مورد وضعیت replica هایتان به دست آورید. 
```bash
$ fandogh service details --name=zero-downtime

Pods:
  Name: zero-downtime-7f9bd757-dh2gk
  Created at: 2018-09-08T11:06:34Z
  Phase: Running
  Ready containers: 1/1
  Containers:
    Name: zero-downtime
    Image: registry.fandogh.cloud/default/zero-downtime:v1.1
    Staus: Ready
    ---------------------
  Name: zero-downtime-7f9bd757-l2b5k
  Created at: 2018-09-08T11:06:52Z
  Phase: Running
  Ready containers: 1/1
  Containers:
    Name: zero-downtime
    Image: registry.fandogh.cloud/default/zero-downtime:v1.1
    Staus: Ready
    ---------------------
```         

همینطور شما می‌توانید لاگ سرویس‌هایتان را به صورت آنی مشاهده کنید و نحوه رفتار سرویستان را مورد بررسی قرار دهید.

```bash
$ fandogh service logs --name=zero-downtime -f 
[zero-downtime-7f9bd757-dh2gk] [zero-downtime] -> Running on http://localhost:8080
[zero-downtime-7f9bd757-l2b5k] [zero-downtime] -> Running on http://localhost:8080

```
برای آشنایی بیشتر با دستورات فندق می‌توانید
 [مستندات فندق](
https://docs.fandogh.cloud/docs/getting-started.html
 )
را مطالعه کنید.
