let shapeMesh;
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("scene") });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f2f5);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 5);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0x888888));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

function generateShape() {
  if (shapeMesh) scene.remove(shapeMesh);
  const type = document.getElementById("shape").value;
  const color = document.getElementById("color").value;

  let geometry;
  switch (type) {
    case "cube": geometry = new THREE.BoxGeometry(1,1,1); break;
    case "sphere": geometry = new THREE.SphereGeometry(0.75, 32, 32); break;
    case "cone": geometry = new THREE.ConeGeometry(0.7, 1.5, 32); break;
    case "torus": geometry = new THREE.TorusGeometry(0.6, 0.2, 16, 100); break;
  }

  const material = new THREE.MeshStandardMaterial({ color });
  shapeMesh = new THREE.Mesh(geometry, material);
  scene.add(shapeMesh);

  document.getElementById("json").textContent = JSON.stringify(shapeMesh.toJSON(), null, 2);
}

function downloadModel() {
  const exporter = new THREE.GLTFExporter();
  exporter.parse(shapeMesh, result => {
    const blob = new Blob([result], { type: 'application/octet-stream' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shape.glb";
    link.click();
  }, { binary: true });
}

document.getElementById("createBtn").onclick = generateShape;
document.getElementById("downloadBtn").onclick = downloadModel;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
generateShape();
