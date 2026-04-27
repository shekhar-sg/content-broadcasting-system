import bootstrap from '../src/main'

const app = bootstrap().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
})

export default app