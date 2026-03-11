import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Facebook redirects here with the token in the URL fragment (#access_token=...)
  // Since fragments aren't sent to the server, we serve a page that reads the fragment
  // and posts it back to the opener window
  const html = `<!DOCTYPE html>
<html>
<head><title>Login...</title></head>
<body>
<script>
  try {
    var hash = window.location.hash.substring(1);
    var params = new URLSearchParams(hash);
    var accessToken = params.get('access_token');
    var userID = null;

    if (accessToken && window.opener) {
      // Get user ID from Facebook
      fetch('https://graph.facebook.com/me?access_token=' + accessToken)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          window.opener.postMessage({
            type: 'FB_LOGIN',
            accessToken: accessToken,
            userID: data.id
          }, window.location.origin);
          window.close();
        })
        .catch(function() {
          window.opener.postMessage({
            type: 'FB_LOGIN_ERROR',
            error: 'Erro ao verificar token'
          }, window.location.origin);
          window.close();
        });
    } else if (window.opener) {
      // Check for error
      var searchParams = new URLSearchParams(window.location.search);
      var error = searchParams.get('error_description') || searchParams.get('error') || 'Login cancelado';
      window.opener.postMessage({
        type: 'FB_LOGIN_ERROR',
        error: error
      }, window.location.origin);
      window.close();
    } else {
      document.body.innerHTML = '<p>Erro: popup perdeu referência. Feche e tente novamente.</p>';
    }
  } catch(e) {
    document.body.innerHTML = '<p>Erro: ' + e.message + '</p>';
  }
</script>
<p>Processando login...</p>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
