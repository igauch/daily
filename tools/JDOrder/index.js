const { exec } = require('child_process')

const main = function () {
  exec('curl -X POST "https://marathon.jd.com/seckillnew/orderService/submitOrder.action?skuId=100012043978" -H "host: marathon.jd.com" -H "accept: application/json, text/plain, */*" -H "origin: https://marathon.jd.com" -H "user-agent: jdapp;android;9.3.3;10;05a137884c72103a;network/wifi;model/Redmi K30 Pro;addressid/137797469;aid/05a137884c72103a;oaid/45a1620b16fe734a;osVer/29;appBuild/86090;psn/05a137884c72103a|115;psq/26;uid/05a137884c72103a;adk/;ads/;pap/JA2015_311210|9.3.3|ANDROID 10;osv/10;pv/107.32;jdv/0|kong|t_1000170135|tuiguang|notset|1607822700694|1607822700;ref/com.jd.lib.productdetail.ProductDetailActivity;partner/xiaomi001;apprpd/Productdetail_MainPage;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 10; Redmi K30 Pro Build/QKQ1.191117.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36" -H "sec-fetch-mode: cors" -H "content-type: application/x-www-form-urlencoded" -H "x-requested-with: com.jingdong.app.mall" -H "sec-fetch-site: same-origin" -H "referer: https://marathon.jd.com/seckillM/seckill.action?skuId=100012043978&num=1&rid=1608775236" -H "accept-language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7" -H "cookie: pt_pin=jd_44074f9512230; pwdt_id=jd_44074f9512230; qd_uid=KHBXAC6C-WVQNZU7V71VS2HWMJ56Q; qd_fs=1605009619217; __jdu=16050096097971412784548; BATQW722QTLYVCRD={\\"tk\\":\\"jdd01AAB3GY3WTKHT2Y75QXJQ4HJQ2YWLOOA234VDZEYMHMQN2KPHJHVPROANEUOT566RCGSQWRJCRBMDVSDTEG3PWDRX5KNBOVUWGQWYJXI01234567\\",\\"t\\":1606290118266}; 3AB9D23F7A4B3C9B=KGLABNEOE73A6ILDBZCZT3PDFBZJ6YCAMRWAGECMM3MEC66IIQ3H5ZICMMSW224AC6GDEFSACP5MQ45JMXVE24V53A; shshshfp=0b4b5f2fcf7e76990c884576ccd38afa; shshshfpa=98310a43-0ac2-7d12-1f81-9243ed13de81-1606522477; shshshfpb=a5a3tco22DrGuHzMFV0PaTA%3D%3D; unpl=V2_ZzNtbRUDRBcnXxUDKxtUAWJXFA0RUUdGJ19EA3IaC1VkUxRfclRCFnQURlRnGVkUZAEZWEpcQhJFOEZVehlYDWEAG1tyVEoRcQ1PXX0pbAZnMxNtQlBCEXcPT1x%2BHl4MYAMRW0FWRxNzCkBkSxlUAlcEFFhBV0YccQ9EXEspXAxkAxdeRlJFFUUJdlVLWDICYAsVVEIaQxJ0DERTchFZAmUKFV1BUUAUcQ5AVn0pXTVk%7CV2_ZzNtbRFXSxV3XE4Efx8JDGIBRlRKB0dGdg5HAStOWAVhBRIKclRCFnQURldnGV0UZAMZWENcQhZFCEJkexhdB2IGFVRCU3Mlc2ZEVXsdXQZubRFcQzkeTTJcdld7KV01ZgdCXUBRShxwWkBXexheVVczG1xyV0IUdgpEVHIaXgViARJtBAIaYCh9ISgcSg5jPl8iXHJWcxRFSShUeh1ZAmYBGxBDUxMVdw5PXX5LWgZnAhANclZzFQ%3D%3D; __jdc=168115133; qd_ls=1606523465079; qd_ts=1607664346771; qd_sq=4; pt_key=app_openAAJf4_U1ADCOkL5BtwU0KBSq0azPHiEKZxLphvHqiIOMqli9If0zJXKWt0TEcACcF-s4oBfHDGI; sid=bd82f4460e0cda60364ce4e9e8a5397w; __jda=168115133.16050096097971412784548.1605009609.1608125022.1608774967.38; __jdv=168115133%7Ckong%7Ct_1000170135%7Ctuiguang%7Cnotset%7C1607822700694; wxa_level=1; retina=1; cid=8; wqmnx1=MDEyNjM5MGhxb29lNTVjOGhpPXBkMDg7d2wzZDNhNzM1ZlZwMDU3NWk4YXMyMUEwcDtuMWl0OHwwbXB0dUFwaWFvaWdvZGxMZCAwbDk7bDVIZVYuLzVCLjVsLzkyYTNPTyZI; jxsid=16087752069447876280; webp=1; visitkey=62617998715458223; __jdb=168115133.2.16050096097971412784548|38.1608774967; mba_sid=107.13; pre_session=05a137884c72103a|115; pre_seq=6; __jd_ref_cls=MSearch_DarkLines; mba_muid=16050096097971412784548.107.1608775208334; seckillSku=100012043978; mid=bbX7i9gBxQdrNWS-3kQw8giSQibIfgGQls8cAYgfE0Q; seckillSid=; seckill100012043978=0C5tbacS57QvqVf0qa5uLF9qe0w/0Asjho+GIEhW+BpqBAqWDVLmFQa2oAuHHQ9CwGdgkpBrtPWIWNNueCsGcZrKg1bKjO4V9k0/VsevtvqKB1WPtq8//eG6wUpMhyI6cWIF4l8PH+hA8OtFFEy/4+52XAyUqQBWa3ZLoPgnPE3v6p9vDHsX3V5aD1PCh3QtqwGhk5lWMjAfZThW" -H "connection: close" -d "num=1&addressId=137797469&yuShou=true&isModifyAddress=false&name=%E7%94%B0%E7%A8%B3%E6%9D%B0&provinceId=12&provinceName=%E6%B1%9F%E8%8B%8F&cityId=904&cityName=%E5%8D%97%E4%BA%AC%E5%B8%82&countyId=3379&countyName=%E9%9B%A8%E8%8A%B1%E5%8F%B0%E5%8C%BA&townId=62183&townName=%E9%93%81%E5%BF%83%E6%A1%A5%E8%A1%97%E9%81%93&addressDetail=%E6%99%AF%E6%98%8E%E4%BD%B3%E5%9B%AD%E7%95%85%E6%99%AF%E8%8B%917%E5%B9%A2402&mobile=186%2A%2A%2A%2A6463&mobileKey=36869885fe01805889369152e5a1bf50&email=&invoiceTitle=4&invoiceCompanyName=&invoiceContent=1&invoiceTaxpayerNO=&invoiceEmail=&invoicePhone=186%2A%2A%2A%2A6463&invoicePhoneKey=36869885fe01805889369152e5a1bf50&invoice=true&password=&codTimeType=3&paymentType=4&overseas=0&phone=&areaCode=86&token=5f6994e4d1889a4d4494602c94d2ecf3"', (error, stdout, stderr) => {
    if (error) {
      console.error(`执行的错误: ${error}`)
      return
    }
    try {
      console.log(`stdout: ${stdout.slice(0, 300)}`)
    } catch (e) {
      console.log(`stdout: ${stdout}`)
    }
    console.error(`stderr: ${stderr}`)
  })
}

const timer = setInterval(() => {
  if (+new Date() > 1609120800000 - 300) {
    clearInterval(timer)
    start()
  }
}, 100)

function start() {
  console.log('start!!!')
  main()
  setInterval(main, 60)
}
