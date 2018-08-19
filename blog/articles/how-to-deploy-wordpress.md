##  deploy کردن وردپرس با فندق
وردپرس یک سیستم مدیریت محتوای بسیار پرطرفدار است که می‌توانید به سادگی روی پلتفرم فندق deploy و استفاده کنید. در این مطلب قصد داریم با هم مراحل deploy کردن وردپرس روی فندق را مرور کنیم.

### خلاصه مراحل
1.  یک حساب کاربری در فندق ساخته و فندق cli ‌را نصب کنید
2. یک سرویس MySQL ‌از طریق دستور managed-service ‌ایجاد کنید.
3. یک داکر فایل برای وردپرس نوشته و روی فندق publish کنید.
4. با set کردن صحیح environment variables وردپرس را deploy کنید.

::: tip نکته
اگر حوصله خواندن ندارید می‌توانید 
 [از این ریپو](https://github.com/fandoghpaas/fandogh-examples/tree/master/wordpress-mysql)
 استفاده کنید :-D
:::


### قدم اول: ساخت اکانت فندق و نصب CLI
کافیه یک سر به آدرس [فندق](http://fandogh.cloud/) بزنید و روی دکمه ثبت‌نام کلیک کنید، فکر نمی‌کنم بیشتر از ۱ دقیقه طول بکشه.
شما برای ارسال دستوراتتون به فندق، به کلاینت فندق یا همون [Fandogh CLI](https://github.com/fandoghpaas/fandogh-cli) هم نیاز دارید که از طریق همین لینک می‌توانید به راحتی نصبش کنید، یا به [معرفی فندق](http://blog.fandogh.cloud/articles/fandogh-introduction.html) مراجعه کنید.


### قدم دوم: ساخت سرویس MySQL
ما در فندق یک قابلیتی ارائه میدیم به نام managed-service  که کمک می‌کنه سرویس‌های رایج را ساده‌تر deploy کنید.
مراحل کار به این شکل هستش:

قبل از هر چیز لازمه که لاگین کنیم
```
fandogh login
```
deploy کردن یک managed-service  فقط یک دستور لازم داره، به شرطی که اسم و ورژن سرویسی که میخواید deploy کنید را بدانید، مثلا برای deploy MySQL ورژن 9.4 دستور زیر کفایت می‌کنه:
```
fandogh managed-service deploy mysql 9.4
```
وقتی دستور را اجرا می‌کنید باید چنین خروجی مشاهده کنید:

```
Your Mysql service will be ready in a few seconds.
You can have access to the PHPMyAdmin via following link:
http://mysql.[YOURNAMESPACE].fandogh.cloud

```
اگر پیغام بالا را مشاهده کردید یعنی سرویس MySQL شما با موفقیت راه‌اندازی شده.

اما حالا که داریم با managed-service کار می‌کنیم بذارید راجع به چند تا از ویژگی‌های قابل اعمال هم صحبت کنیم.
همون طور که
[اینجا مستند شده](https://github.com/fandoghpaas/fandogh-cli#configuration)
شما برای deploy کردن MySQL یه سری گزینه قابل تنظیم دارید:
* service_name
همون طور که توی مستندات فندق هست، همه سرویس‌هایی که داخل یک namespace در حال اجرا هستند یک DNS داخلی دارند و سرویس‌های مختلف از طریق service_name می‌توانند همدیگر را پیدا کنند و به هم متصل بشوند.
وقتی یک managed-service برای MySQL ایجاد می‌کنید اسم پیش‌فرضش mysql هستش، یعنی سرویس‌های دیگه باید توی شبکه دنبال نام mysql بگردند تا به آن وصل شوند، از طریق این گزینه می‌توانید اسم دیگه‌ای به آن نسبت بدید.

* phpmyadmin_enabled
از طریق این گزینه می‌توانید PHPMyAdmin را فعال یا غیر فعال کنید

* mysql_root_password
این هم از اسمش پیداست، میشه از طریقش پسورد روت MySQL را مشخص کرد


برای اینکه یک سری از امکانات دیگه فندق را هم ببینیم  توی این ‌آموزش ما قصد نداریم از PHPMyAdmin استفاده کنیم، پس اجازه بدید به این شکل سرویس MySQL را ایجاد کنیم:

```
fandogh managed-service deploy mysql 9.4 -c service_name=my-database -c phpmyadmin_enabled=false -c mysql_root_password=somepassword

```



### قدم سوم: نوشتن Dockerfile و publish کردن وردپرس

برای اینکار یک Directory بسازید روی سیستم خودتون، مثلا اسمش را می‌‌گذاریم my-wp-blog  و وارد اون Directory بشید.
یک فایل به نام `Dockerfile` بسازید و تنها چیزی که لازمه داخلش بنویسید همینه:
```
FROM wordpress

```با اینکار ما یک Image کاملا مشابه با Image اصلی وردپرس ساختیم و از همون استفاده می‌کنیم، توضیحات مربوط به image اصلی وردپرس رو می‌توانید [اینجا](https://hub.docker.com/_/wordpress/) مشاهده کنید
حالا در حالی که داخل اون Directory هستید باید فقط یک فایل داشته باشید به نام Dockerfile  با محتویاتی که بالاتر اشاره کردم، الان کافیه که اول image هاتون را روی فندق init کنید و بعد هم ورژن بزنید و publish کنید:

```
fandogh image init
```
که از شما یک اسم می‌خواد،
```
fandogh image publish
```
که از شما ورژن می‌خواد
اگر همه چیز خوب پیش بره باید وقتی لیست ورژن‌ها را میگیرید این ورژن وضعیتش `BUILT` باشه:
```
fandogh image versions
```


### قدم چهارم و آخر: deploy کردن وردپرس روی فندق

برای deploy کردن imageای که توی قدم قبلی ساختیم باید از کامند `service deploy‍` فندق استفاده کنیم، اما باید به وردپرس بگیم که کجا باید دنبال دیتابیس بگرده 
طبق داکرفایلی که نوشتیم تو قدم قبلی image ما براساس 
[ایمیج رسمی وردپرس](https://hub.docker.com/_/wordpress/)
 ساخته شده و ایمیج رسمی وردپرس یه سری environment variable دریافت می‌کنه.پارامتر‌هایی که برای ما مهم هستند، پارامتر‌های مربوط به دیتابیس هستند( البته لیست کاملش توی همین لینکی که گذاشتم هست)‌:
* WORDPRESS_DB_HOST
* WORDPRESS_DB_USER
* WORDPRESS_DB_PASSWORD
* WORDPRESS_DB_NAME

ما می‌تونیم موقع deploy سرویس این پارامتر‌ها را هم از طریق `-e` ست کنیم بنابر این کامندی که اجرا می‌کنیم میشه این:

```
fandogh service deploy -e WORDPRESS_DB_HOST=my-database -e WORDPRESS_DB_USER=root -e WORDPRESS_DB_PASSWORD=somepassword -e WORDPRESS_DB_NAME=wp

```
مقدار هر کدوم از این متغیر‌ها را از روی مقادیری که موقع ساخت سرویس MySQL مشخص کردیم باید بردارید.      
بعد از اجرا از شما در مورد اینکه کدوم ورژن را مایلید deploy کنید می‌پرسه و اینکه اسم سرویستون چیه و اگر همه چیز خوب پیش بره خروجی مورد نظر این باید باشه:

```
The image version: v1
Your service name: mywp
Your service deployed successfully.
The service is accessible via following link:
http://[YOUR-SERVICE-NAME].[YOUR-NAMESPACE].fandogh.cloud

```
اگر به آدرس بالا مراجعه کنید با صفحه نصب wordpress مواجه میشید و این یعنی سرویس وردپرس شما آماده است.


ممنون که همراه ما هستید، هر سوال یا مشکلی در مورد استفاده از فندق داشتید حتما توی قسمت 
[ایشو‌های گیت‌هاب ](https://github.com/fandoghpaas/fandogh-cli/issues)
با ما به اشتراک بگذارید، خوشحال میشیم نظرات و انتقادات شما را بشنویم.


