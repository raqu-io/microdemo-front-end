// Require dependencies
var zipkinUrl = process.env.ZIPKIN_URL || false
"use strict";
if (zipkinUrl) {
    const {
        BasicTracerProvider,
        ConsoleSpanExporter,
        SimpleSpanProcessor,
    } = require("@opentelemetry/tracing");
    const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
    const {Resource} = require("@opentelemetry/resources");
    const {
        SemanticResourceAttributes,
    } = require("@opentelemetry/semantic-conventions");

    const opentelemetry = require("@opentelemetry/sdk-node");
    const {
        getNodeAutoInstrumentations,
    } = require("@opentelemetry/auto-instrumentations-node");

    const exporter = new ZipkinExporter({url: zipkinUrl})

    const provider = new BasicTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]:
                process.env.NOMAD_TASK_NAME,
        }),
    });
    // export spans to console (useful for debugging)
    // provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
    // export spans to zipkin collector
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

    provider.register();
    const sdk = new opentelemetry.NodeSDK({
        traceExporter: exporter,
        instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk
        .start()
        .then(() => {
            console.log("Tracing initialized and exporting into: " + zipkinUrl);
        })
        .catch((error) => console.log("Error initializing tracing", error));

    process.on("SIGTERM", () => {
        sdk
            .shutdown()
            .then(() => console.log("Tracing terminated"))
            .catch((error) => console.log("Error terminating tracing", error))
            .finally(() => process.exit(0));
    });
}