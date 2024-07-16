new EventSource("/esbuild").addEventListener("change", () => location.reload());

console.log("hello");
document.body.innerText = "hello there";
