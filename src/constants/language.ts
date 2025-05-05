export interface Language {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  level?: number;
  createdAt?: string;
  updatedAt?: string;
  designed_by: string;
  popularity_rank: number,
  first_appeared: number,
  slug: string,
  usage: string,
  type_system: string,
  paradigm: string[],
}

export const initialLanguage: Language = {
  _id: "",
  name: "",
  description: "",
  category: "",
  level: 1,
  slug: "",
  designed_by: "",
  popularity_rank: 1,
  first_appeared: 1940,
  usage: "",
  type_system: "",
  paradigm: [],
};
export const ParadigmOptions = [
  { "value": "procedural", "label": "Procedural Programming" },
  { "value": "oop", "label": "Object-Oriented Programming" },
  { "value": "functional", "label": "Functional Programming" },
  { "value": "logic", "label": "Logic Programming" },
  { "value": "declarative", "label": "Declarative Programming" },
  { "value": "imperative", "label": "Imperative Programming" },
  { "value": "event_driven", "label": "Event-Driven Programming" },
  { "value": "reactive", "label": "Reactive Programming" },
  { "value": "concurrent", "label": "Concurrent Programming" },
  { "value": "parallel", "label": "Parallel Programming" },
  { "value": "aop", "label": "Aspect-Oriented Programming" },
  { "value": "constraint", "label": "Constraint Programming" },
  { "value": "rule_based", "label": "Rule-Based Programming" },
  { "value": "actor_model", "label": "Actor Model" },
  { "value": "component_based", "label": "Component-Based Programming" },
  { "value": "dataflow", "label": "Dataflow Programming" },
  { "value": "automata", "label": "Automata-Based Programming" },
  { "value": "symbolic", "label": "Symbolic Programming" },
  { "value": "array", "label": "Array Programming" },
  { "value": "pipeline", "label": "Pipeline Programming" },
  { "value": "dsl", "label": "Domain-Specific Language (DSL)" },
  { "value": "reflective", "label": "Reflective Programming" },
  { "value": "meta", "label": "Meta-Programming" },
  { "value": "soa", "label": "Service-Oriented Programming" },
  { "value": "flow_based", "label": "Flow-Based Programming" },
  { "value": "visual", "label": "Visual Programming" },
  { "value": "clp", "label": "Constraint Logic Programming" },
  { "value": "mde", "label": "Model-Driven Engineering" },
  { "value": "tdd", "label": "Test-Driven Development" },
  { "value": "agent_based", "label": "Agent-Based Programming" },
  { "value": "layered", "label": "Layered Programming" },
  { "value": "message_passing", "label": "Message-Passing Programming" },
  { "value": "microservices", "label": "Microservices Architecture" },
  { "value": "monadic", "label": "Monadic Programming" },
  { "value": "cps", "label": "Continuation-Passing Style" },
  { "value": "tuple_space", "label": "Tuple Spaces Programming" },
  { "value": "pure_functional", "label": "Pure Functional Programming" },
  { "value": "imperative_oop", "label": "Imperative Object-Oriented Programming" },
  { "value": "event_sourcing", "label": "Event Sourcing" },
  { "value": "hybrid", "label": "Hybrid Programming Paradigm" }
]
