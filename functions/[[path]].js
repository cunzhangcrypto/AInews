export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  let path = url.pathname;

  // 如果访问首页，强制去找最新的 current.html
  if (path === "/" || path === "") {
    path = "/output/html/latest/current.html";
  }

  // 去绑定的 R2 存储桶（BUCKET）里抓取文件
  const object = await env.BUCKET.get(path.substring(1));

  if (!object) {
    return new Response("村长，R2里还没这个文件，请确保Action运行成功且生成了网页", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Content-Type", "text/html; charset=utf-8");

  return new Response(object.body, { headers });
}
