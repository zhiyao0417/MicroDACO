"use strict";

const { Namespace } = require("kubernetes-models/v1/Namespace");
const { Deployment } = require("kubernetes-models/apps/v1/Deployment");
const { Service } = require("kubernetes-models/v1/Service");
const env = require("@kosko/env");
const params = env.component("nginx");

const namespace = new Namespace({
  "metadata": {
    "name": "sock-shop"
  }
});

const deployment = new Deployment({
  "metadata": {
    "name": "carts",
    "labels": {
      "name": "carts"
    },
    "namespace": params.namespace
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "carts"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "carts"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "carts",
            "image": "weaveworksdemos/carts:0.4.8",
            "env": [
              {
                "name": "JAVA_OPTS",
                "value": "-Xms64m -Xmx128m -XX:+UseG1GC -Djava.security.egd=file:/dev/urandom -Dspring.zipkin.enabled=false"
              }
            ],
            "resources": {
              "limits": {
                "cpu": "300m",
                "memory": "500Mi"
              },
              "requests": {
                "cpu": "100m",
                "memory": "200Mi"
              }
            },
            "ports": [
              {
                "containerPort": 80
              }
            ],
            "securityContext": {
              "runAsNonRoot": true,
              "runAsUser": 10001,
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "NET_BIND_SERVICE"
                ]
              },
              "readOnlyRootFilesystem": true
            },
            "volumeMounts": [
              {
                "mountPath": "/tmp",
                "name": "tmp-volume"
              }
            ]
          }
        ],
        "volumes": [
          {
            "name": "tmp-volume",
            "emptyDir": {
              "medium": "Memory"
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service = new Service({
  "metadata": {
    "name": "carts",
    "annotations": {
      "prometheus.io/scrape": "true"
    },
    "labels": {
      "name": "carts"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 80,
        "targetPort": 80
      }
    ],
    "selector": {
      "name": "carts"
    }
  }
});

const deployment1 = new Deployment({
  "metadata": {
    "name": "carts-db",
    "labels": {
      "name": "carts-db"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "carts-db"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "carts-db"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "carts-db",
            "image": "mongo",
            "ports": [
              {
                "name": "mongo",
                "containerPort": 27017
              }
            ],
            "securityContext": {
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "CHOWN",
                  "SETGID",
                  "SETUID"
                ]
              },
              "readOnlyRootFilesystem": true
            },
            "volumeMounts": [
              {
                "mountPath": "/tmp",
                "name": "tmp-volume"
              }
            ]
          }
        ],
        "volumes": [
          {
            "name": "tmp-volume",
            "emptyDir": {
              "medium": "Memory"
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service1 = new Service({
  "metadata": {
    "name": "carts-db",
    "labels": {
      "name": "carts-db"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 27017,
        "targetPort": 27017
      }
    ],
    "selector": {
      "name": "carts-db"
    }
  }
});

const deployment2 = new Deployment({
  "metadata": {
    "name": "catalogue",
    "labels": {
      "name": "catalogue"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "catalogue"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "catalogue"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "catalogue",
            "image": "weaveworksdemos/catalogue:0.3.5",
            "command": [
              "/app"
            ],
            "args": [
              "-port=80"
            ],
            "resources": {
              "limits": {
                "cpu": "200m",
                "memory": "200Mi"
              },
              "requests": {
                "cpu": "100m",
                "memory": "100Mi"
              }
            },
            "ports": [
              {
                "containerPort": 80
              }
            ],
            "securityContext": {
              "runAsNonRoot": true,
              "runAsUser": 10001,
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "NET_BIND_SERVICE"
                ]
              },
              "readOnlyRootFilesystem": true
            },
            "livenessProbe": {
              "httpGet": {
                "path": "/health",
                "port": 80
              },
              "initialDelaySeconds": 300,
              "periodSeconds": 3
            },
            "readinessProbe": {
              "httpGet": {
                "path": "/health",
                "port": 80
              },
              "initialDelaySeconds": 180,
              "periodSeconds": 3
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service2 = new Service({
  "metadata": {
    "name": "catalogue",
    "annotations": {
      "prometheus.io/scrape": "true"
    },
    "labels": {
      "name": "catalogue"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 80,
        "targetPort": 80
      }
    ],
    "selector": {
      "name": "catalogue"
    }
  }
});

const deployment3 = new Deployment({
  "metadata": {
    "name": "catalogue-db",
    "labels": {
      "name": "catalogue-db"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "catalogue-db"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "catalogue-db"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "catalogue-db",
            "image": "weaveworksdemos/catalogue-db:0.3.0",
            "env": [
              {
                "name": "MYSQL_ROOT_PASSWORD",
                "value": "fake_password"
              },
              {
                "name": "MYSQL_DATABASE",
                "value": "socksdb"
              }
            ],
            "ports": [
              {
                "name": "mysql",
                "containerPort": 3306
              }
            ]
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service3 = new Service({
  "metadata": {
    "name": "catalogue-db",
    "labels": {
      "name": "catalogue-db"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 3306,
        "targetPort": 3306
      }
    ],
    "selector": {
      "name": "catalogue-db"
    }
  }
});

const deployment4 = new Deployment({
  "metadata": {
    "name": "front-end",
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "front-end"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "front-end"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "front-end",
            "image": "weaveworksdemos/front-end:0.3.12",
            "resources": {
              "limits": {
                "cpu": "300m",
                "memory": "1000Mi"
              },
              "requests": {
                "cpu": "100m",
                "memory": "300Mi"
              }
            },
            "ports": [
              {
                "containerPort": 8079
              }
            ],
            "env": [
              {
                "name": "SESSION_REDIS",
                "value": "true"
              }
            ],
            "securityContext": {
              "runAsNonRoot": true,
              "runAsUser": 10001,
              "capabilities": {
                "drop": [
                  "all"
                ]
              },
              "readOnlyRootFilesystem": true
            },
            "livenessProbe": {
              "httpGet": {
                "path": "/",
                "port": 8079
              },
              "initialDelaySeconds": 300,
              "periodSeconds": 3
            },
            "readinessProbe": {
              "httpGet": {
                "path": "/",
                "port": 8079
              },
              "initialDelaySeconds": 30,
              "periodSeconds": 3
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service4 = new Service({
  "metadata": {
    "name": "front-end",
    "annotations": {
      "prometheus.io/scrape": "true"
    },
    "labels": {
      "name": "front-end"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "type": "NodePort",
    "ports": [
      {
        "port": 80,
        "targetPort": 8079,
        "nodePort": 30001
      }
    ],
    "selector": {
      "name": "front-end"
    }
  }
});

const deployment5 = new Deployment({
  "metadata": {
    "name": "orders",
    "labels": {
      "name": "orders"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "orders"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "orders"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "orders",
            "image": "weaveworksdemos/orders:0.4.7",
            "env": [
              {
                "name": "JAVA_OPTS",
                "value": "-Xms64m -Xmx128m -XX:+UseG1GC -Djava.security.egd=file:/dev/urandom -Dspring.zipkin.enabled=false"
              }
            ],
            "resources": {
              "limits": {
                "cpu": "500m",
                "memory": "500Mi"
              },
              "requests": {
                "cpu": "100m",
                "memory": "300Mi"
              }
            },
            "ports": [
              {
                "containerPort": 80
              }
            ],
            "securityContext": {
              "runAsNonRoot": true,
              "runAsUser": 10001,
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "NET_BIND_SERVICE"
                ]
              },
              "readOnlyRootFilesystem": true
            },
            "volumeMounts": [
              {
                "mountPath": "/tmp",
                "name": "tmp-volume"
              }
            ]
          }
        ],
        "volumes": [
          {
            "name": "tmp-volume",
            "emptyDir": {
              "medium": "Memory"
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service5 = new Service({
  "metadata": {
    "name": "orders",
    "annotations": {
      "prometheus.io/scrape": "true"
    },
    "labels": {
      "name": "orders"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 80,
        "targetPort": 80
      }
    ],
    "selector": {
      "name": "orders"
    }
  }
});

const deployment6 = new Deployment({
  "metadata": {
    "name": "orders-db",
    "labels": {
      "name": "orders-db"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "orders-db"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "orders-db"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "orders-db",
            "image": "mongo",
            "ports": [
              {
                "name": "mongo",
                "containerPort": 27017
              }
            ],
            "securityContext": {
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "CHOWN",
                  "SETGID",
                  "SETUID"
                ]
              },
              "readOnlyRootFilesystem": true
            },
            "volumeMounts": [
              {
                "mountPath": "/tmp",
                "name": "tmp-volume"
              }
            ]
          }
        ],
        "volumes": [
          {
            "name": "tmp-volume",
            "emptyDir": {
              "medium": "Memory"
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service6 = new Service({
  "metadata": {
    "name": "orders-db",
    "labels": {
      "name": "orders-db"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 27017,
        "targetPort": 27017
      }
    ],
    "selector": {
      "name": "orders-db"
    }
  }
});

const deployment7 = new Deployment({
  "metadata": {
    "name": "payment",
    "labels": {
      "name": "payment"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "payment"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "payment"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "payment",
            "image": "weaveworksdemos/payment:0.4.3",
            "resources": {
              "limits": {
                "cpu": "200m",
                "memory": "200Mi"
              },
              "requests": {
                "cpu": "99m",
                "memory": "100Mi"
              }
            },
            "ports": [
              {
                "containerPort": 80
              }
            ],
            "securityContext": {
              "runAsNonRoot": true,
              "runAsUser": 10001,
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "NET_BIND_SERVICE"
                ]
              },
              "readOnlyRootFilesystem": true
            },
            "livenessProbe": {
              "httpGet": {
                "path": "/health",
                "port": 80
              },
              "initialDelaySeconds": 300,
              "periodSeconds": 3
            },
            "readinessProbe": {
              "httpGet": {
                "path": "/health",
                "port": 80
              },
              "initialDelaySeconds": 180,
              "periodSeconds": 3
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service7 = new Service({
  "metadata": {
    "name": "payment",
    "annotations": {
      "prometheus.io/scrape": "true"
    },
    "labels": {
      "name": "payment"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 80,
        "targetPort": 80
      }
    ],
    "selector": {
      "name": "payment"
    }
  }
});

const deployment8 = new Deployment({
  "metadata": {
    "name": "queue-master",
    "labels": {
      "name": "queue-master"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "queue-master"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "queue-master"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "queue-master",
            "image": "weaveworksdemos/queue-master:0.3.1",
            "env": [
              {
                "name": "JAVA_OPTS",
                "value": "-Xms64m -Xmx128m -XX:+UseG1GC -Djava.security.egd=file:/dev/urandom -Dspring.zipkin.enabled=false"
              }
            ],
            "resources": {
              "limits": {
                "cpu": "300m",
                "memory": "500Mi"
              },
              "requests": {
                "cpu": "100m",
                "memory": "300Mi"
              }
            },
            "ports": [
              {
                "containerPort": 80
              }
            ]
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service8 = new Service({
  "metadata": {
    "name": "queue-master",
    "annotations": {
      "prometheus.io/scrape": "true"
    },
    "labels": {
      "name": "queue-master"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 80,
        "targetPort": 80
      }
    ],
    "selector": {
      "name": "queue-master"
    }
  }
});

const deployment9 = new Deployment({
  "metadata": {
    "name": "rabbitmq",
    "labels": {
      "name": "rabbitmq"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "rabbitmq"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "rabbitmq"
        },
        "annotations": {
          "prometheus.io/scrape": "false"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "rabbitmq",
            "image": "rabbitmq:3.6.8-management",
            "ports": [
              {
                "containerPort": 15672,
                "name": "management"
              },
              {
                "containerPort": 5672,
                "name": "rabbitmq"
              }
            ],
            "securityContext": {
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "CHOWN",
                  "SETGID",
                  "SETUID",
                  "DAC_OVERRIDE"
                ]
              },
              "readOnlyRootFilesystem": true
            }
          },
          {
            "name": "rabbitmq-exporter",
            "image": "kbudde/rabbitmq-exporter",
            "ports": [
              {
                "containerPort": 9090,
                "name": "exporter"
              }
            ]
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service9 = new Service({
  "metadata": {
    "name": "rabbitmq",
    "annotations": {
      "prometheus.io/scrape": "true",
      "prometheus.io/port": "9090"
    },
    "labels": {
      "name": "rabbitmq"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 5672,
        "name": "rabbitmq",
        "targetPort": 5672
      },
      {
        "port": 9090,
        "name": "exporter",
        "targetPort": "exporter",
        "protocol": "TCP"
      }
    ],
    "selector": {
      "name": "rabbitmq"
    }
  }
});

const deployment10 = new Deployment({
  "metadata": {
    "name": "session-db",
    "labels": {
      "name": "session-db"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "session-db"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "session-db"
        },
        "annotations": {
          "prometheus.io.scrape": "false"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "session-db",
            "image": "redis:alpine",
            "ports": [
              {
                "name": "redis",
                "containerPort": 6379
              }
            ],
            "securityContext": {
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "CHOWN",
                  "SETGID",
                  "SETUID"
                ]
              },
              "readOnlyRootFilesystem": true
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service10 = new Service({
  "metadata": {
    "name": "session-db",
    "labels": {
      "name": "session-db"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 6379,
        "targetPort": 6379
      }
    ],
    "selector": {
      "name": "session-db"
    }
  }
});

const deployment11 = new Deployment({
  "metadata": {
    "name": "shipping",
    "labels": {
      "name": "shipping"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "shipping"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "shipping"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "shipping",
            "image": "weaveworksdemos/shipping:0.4.8",
            "env": [
              {
                "name": "ZIPKIN",
                "value": "zipkin.jaeger.svc.cluster.local"
              },
              {
                "name": "JAVA_OPTS",
                "value": "-Xms64m -Xmx128m -XX:+UseG1GC -Djava.security.egd=file:/dev/urandom -Dspring.zipkin.enabled=false"
              }
            ],
            "resources": {
              "limits": {
                "cpu": "300m",
                "memory": "500Mi"
              },
              "requests": {
                "cpu": "100m",
                "memory": "300Mi"
              }
            },
            "ports": [
              {
                "containerPort": 80
              }
            ],
            "securityContext": {
              "runAsNonRoot": true,
              "runAsUser": 10001,
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "NET_BIND_SERVICE"
                ]
              },
              "readOnlyRootFilesystem": true
            },
            "volumeMounts": [
              {
                "mountPath": "/tmp",
                "name": "tmp-volume"
              }
            ]
          }
        ],
        "volumes": [
          {
            "name": "tmp-volume",
            "emptyDir": {
              "medium": "Memory"
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service11 = new Service({
  "metadata": {
    "name": "shipping",
    "annotations": {
      "prometheus.io/scrape": "true"
    },
    "labels": {
      "name": "shipping"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 80,
        "targetPort": 80
      }
    ],
    "selector": {
      "name": "shipping"
    }
  }
});

const deployment12 = new Deployment({
  "metadata": {
    "name": "user",
    "labels": {
      "name": "user"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "user"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "user"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "user",
            "image": "weaveworksdemos/user:0.4.7",
            "resources": {
              "limits": {
                "cpu": "300m",
                "memory": "200Mi"
              },
              "requests": {
                "cpu": "100m",
                "memory": "100Mi"
              }
            },
            "ports": [
              {
                "containerPort": 80
              }
            ],
            "env": [
              {
                "name": "mongo",
                "value": "user-db:27017"
              }
            ],
            "securityContext": {
              "runAsNonRoot": true,
              "runAsUser": 10001,
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "NET_BIND_SERVICE"
                ]
              },
              "readOnlyRootFilesystem": true
            },
            "livenessProbe": {
              "httpGet": {
                "path": "/health",
                "port": 80
              },
              "initialDelaySeconds": 300,
              "periodSeconds": 3
            },
            "readinessProbe": {
              "httpGet": {
                "path": "/health",
                "port": 80
              },
              "initialDelaySeconds": 180,
              "periodSeconds": 3
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service12 = new Service({
  "metadata": {
    "name": "user",
    "annotations": {
      "prometheus.io/scrape": "true"
    },
    "labels": {
      "name": "user"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 80,
        "targetPort": 80
      }
    ],
    "selector": {
      "name": "user"
    }
  }
});

const deployment13 = new Deployment({
  "metadata": {
    "name": "user-db",
    "labels": {
      "name": "user-db"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "name": "user-db"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "name": "user-db"
        }
      },
      "spec": {
        "containers": [
          {
            "name": "user-db",
            "image": "weaveworksdemos/user-db:0.3.0",
            "ports": [
              {
                "name": "mongo",
                "containerPort": 27017
              }
            ],
            "securityContext": {
              "capabilities": {
                "drop": [
                  "all"
                ],
                "add": [
                  "CHOWN",
                  "SETGID",
                  "SETUID"
                ]
              },
              "readOnlyRootFilesystem": true
            },
            "volumeMounts": [
              {
                "mountPath": "/tmp",
                "name": "tmp-volume"
              }
            ]
          }
        ],
        "volumes": [
          {
            "name": "tmp-volume",
            "emptyDir": {
              "medium": "Memory"
            }
          }
        ],
        "nodeSelector": {
          "beta.kubernetes.io/os": "linux"
        }
      }
    }
  }
});

const service13 = new Service({
  "metadata": {
    "name": "user-db",
    "labels": {
      "name": "user-db"
    },
    "namespace": "sock-shop"
  },
  "spec": {
    "ports": [
      {
        "port": 27017,
        "targetPort": 27017
      }
    ],
    "selector": {
      "name": "user-db"
    }
  }
});

module.exports = [namespace, deployment, service, deployment1, service1, deployment2, service2, deployment3, service3, deployment4, service4, deployment5, service5, deployment6, service6, deployment7, service7, deployment8, service8, deployment9, service9, deployment10, service10, deployment11, service11, deployment12, service12, deployment13, service13];
