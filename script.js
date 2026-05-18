const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const numberOfParticles = 80;
const connectionDistance = 120;
const repulsionRadius = 100;

// Objeto para rastrear as coordenadas do mouse globalmente
const mouse = {
    x: null,
    y: null
};

// Captura o movimento do mouse na janela
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Limpa as coordenadas quando o mouse sai da tela
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Ajusta o tamanho do canvas dinamicamente se a janela mudar de tamanho
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Inicializa o tamanho correto do canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Molde (Classe) para criar cada partícula
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.baseX = this.x;
        this.baseY = this.y;
    }

    // Atualiza a posição e verifica a proximidade com o mouse
    update() {
        // Movimento contínuo básico
        this.x += this.speedX;
        this.y += this.speedY;

        // Trata colisões com as bordas da tela
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Interação de repulsão com o mouse
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < repulsionRadius) {
                // Força inversamente proporcional à distância
                let force = (repulsionRadius - distance) / repulsionRadius;
                let directionX = dx / distance;
                let directionY = dy / distance;
                
                // Empurra a partícula na direção oposta à do mouse
                this.x -= directionX * force * 2;
                this.y -= directionY * force * 2;
            }
        }
    }

    // Desenha o ponto da partícula na tela
    draw() {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)'; // Azul-ciano translúcido
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Preenche o array com as instâncias de partículas
function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Traça as linhas entre as partículas próximas
function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                // Quanto mais perto, mais opaca fica a linha de conexão
                let opacity = (1 - (distance / connectionDistance)) * 0.15;
                ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].bX || particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Loop de animação contínuo (renderizador)
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela para o próximo frame
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    connectParticles();
    requestAnimationFrame(animate); // Chama o próximo frame de forma otimizada para a GPU
}

// Execução inicial
init();
animate();