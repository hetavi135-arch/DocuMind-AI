import { DocumentItem } from '../src/types/document.js';

export const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-sample-transformers',
    name: 'Attention Is All You Need - Transformer Architecture.pdf',
    originalName: 'Attention_Is_All_You_Need.pdf',
    fileSize: 2241950,
    pageCount: 6,
    wordCount: 3820,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'ready',
    pages: [
      {
        pageNumber: 1,
        wordCount: 620,
        text: `Attention Is All You Need. Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin.
Abstract: The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature.`
      },
      {
        pageNumber: 2,
        wordCount: 680,
        text: `1. Introduction and Background.
Recurrent models generate sequences of hidden states h_t, as a function of the previous hidden state h_{t-1} and the input for position t. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples. Attention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences. In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.`
      },
      {
        pageNumber: 3,
        wordCount: 710,
        text: `2. Model Architecture.
Most competitive neural sequence transduction models have an encoder-decoder structure. The encoder maps an input sequence of symbol representations (x_1, ..., x_n) to a sequence of continuous representations z = (z_1, ..., z_n). Given z, the decoder then generates an output sequence (y_1, ..., y_m) of symbols one element at a time. At each step the model is auto-regressive, consuming the previously generated symbols as additional input when generating the next.
Encoder and Decoder Stacks: The encoder is composed of a stack of N = 6 identical layers. Each layer has two sub-layers: a multi-head self-attention mechanism, and a simple, position-wise fully connected feed-forward network. We employ a residual connection around each of the two sub-layers, followed by layer normalization. The output of each sub-layer is LayerNorm(x + Sublayer(x)). To facilitate these residual connections, all sub-layers in the model, as well as the embedding layers, produce outputs of dimension d_model = 512.
The decoder is also composed of a stack of N = 6 identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer, which performs multi-head attention over the output of the encoder stack. We also modify the self-attention sub-layer in the decoder stack to prevent positions from attending to subsequent positions. This masking ensures that the predictions for position i can depend only on the known outputs at positions less than i.`
      },
      {
        pageNumber: 4,
        wordCount: 640,
        text: `3. Scaled Dot-Product and Multi-Head Attention.
An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.
We call our particular attention "Scaled Dot-Product Attention". The input consists of queries and keys of dimension d_k, and values of dimension d_v. We compute the dot products of the query with all keys, divide each by sqrt(d_k), and apply a softmax function to obtain the weights on the values. In practice, we compute the attention function on a set of queries simultaneously, packed together into a matrix Q. The keys and values are also packed into matrices K and V. We compute the matrix of outputs as:
Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V.
Multi-Head Attention: Instead of performing a single attention function with d_model-dimensional queries, keys and values, we found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections to d_k, d_k and d_v dimensions, respectively. On each of these projected versions of queries, keys and values we then perform the attention function in parallel, yielding d_v-dimensional output values. These are concatenated and once again projected, resulting in final values. Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions.`
      },
      {
        pageNumber: 5,
        wordCount: 590,
        text: `4. Positional Encoding and Training.
Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence. To this end, we add "positional encodings" to the input embeddings at the bottoms of the encoder and decoder stacks. The positional encodings have the same dimension d_model as the embeddings, so that the two can be summed. We use sine and cosine functions of different frequencies:
PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
Training Details: We trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs. Sentences were encoded using byte-pair encoding, which has a shared source-target vocabulary of about 37000 tokens. For English-French, we used the significantly larger WMT 2014 English-French dataset consisting of 36 million sentences. We used the Adam optimizer with beta_1 = 0.9, beta_2 = 0.98 and epsilon = 10^-9. We varied the learning rate over the course of training according to the formula with 4000 warmup steps.`
      },
      {
        pageNumber: 6,
        wordCount: 580,
        text: `5. Results and Conclusion.
On the WMT 2014 English-to-German translation task, the big transformer model (Transformer (big)) outperforms the best previously reported models by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4. Training took 3.5 days on 8 P100 GPUs. Even our base model surpasses all previously published models and ensembles, at a fraction of the training cost. On the WMT 2014 English-to-French translation task, our big model achieves a BLEU score of 41.8, outperforming all previously published single models.
Conclusion: In this work, we presented the Transformer, the first sequence transduction model based entirely on attention, replacing the recurrent layers most commonly used in encoder-decoder architectures with multi-headed self-attention. For translation tasks, the Transformer can be trained significantly faster than architectures based on recurrent or convolutional layers. We plan to extend the Transformer to problems involving input and output modalities other than text and to investigate local, restricted attention mechanisms to efficiently handle large inputs and outputs such as images, audio and video.`
      }
    ],
    chunks: [
      {
        id: 'chunk-1-0',
        pageNumber: 1,
        chunkIndex: 0,
        text: 'The Transformer model is based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Achieves 28.4 BLEU on WMT 2014 English-to-German and 41.8 BLEU on English-to-French translation after 3.5 days on 8 GPUs.'
      },
      {
        id: 'chunk-2-1',
        pageNumber: 2,
        chunkIndex: 1,
        text: 'Recurrent models generate hidden states sequentially, which precludes parallelization within training examples. Memory constraints limit batching at longer sequence lengths. The Transformer relies entirely on attention to draw global dependencies between inputs and outputs.'
      },
      {
        id: 'chunk-3-2',
        pageNumber: 3,
        chunkIndex: 2,
        text: 'Encoder and Decoder Stacks: Encoder has N=6 identical layers, each with multi-head self-attention and position-wise feed-forward network with residual connections and layer normalization (output dimension d_model=512). Decoder has N=6 layers with masking to prevent attending to future tokens.'
      },
      {
        id: 'chunk-4-3',
        pageNumber: 4,
        chunkIndex: 3,
        text: 'Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V. Scaling by sqrt(d_k) prevents vanishing gradients for large dimensions. Multi-Head Attention projects Q, K, V into h different subspaces and attends in parallel.'
      },
      {
        id: 'chunk-5-4',
        pageNumber: 5,
        chunkIndex: 4,
        text: 'Positional Encodings: Uses sine and cosine functions of varying frequencies to inject sequence order without recurrence. Training used Adam optimizer (beta1=0.9, beta2=0.98) with warmup schedule on 4.5M WMT sentence pairs.'
      },
      {
        id: 'chunk-6-5',
        pageNumber: 6,
        chunkIndex: 5,
        text: 'Results: Big Transformer model achieved state-of-the-art BLEU of 28.4 on English-to-German and 41.8 on English-to-French with far lower training FLOPs. Future directions include multi-modal inputs (audio, video, images) and restricted local attention.'
      }
    ]
  },
  {
    id: 'doc-sample-clean-energy',
    name: 'Clean Energy Transition & Grid Modernization Roadmap 2026.pdf',
    originalName: 'Clean_Energy_Transition_Roadmap_2026.pdf',
    fileSize: 1845100,
    pageCount: 4,
    wordCount: 2940,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    status: 'ready',
    pages: [
      {
        pageNumber: 1,
        wordCount: 710,
        text: `Clean Energy Transition and Grid Modernization Roadmap 2026-2035.
Executive Summary: Global energy transitions have reached a pivotal inflection point in 2026. Variable Renewable Energy (VRE), primarily solar photovoltaics and onshore/offshore wind, accounted for 34% of global electricity generation in 2025 and is projected to surpass 52% by 2032. However, legacy transmission grids originally engineered for centralized fossil generation face acute transmission bottlenecks, interconnect queues exceeding 1,200 Gigawatts in North America and Europe, and curtailment rates surpassing 8% in high-penetration zones. This report synthesizes multi-regional technical modeling to outline strategic capital allocation, storage integration thresholds, and regulatory modernizations needed to maintain 99.999% grid reliability.`
      },
      {
        pageNumber: 2,
        wordCount: 740,
        text: `Section 2: Utility-Scale Battery Energy Storage Systems (BESS) and Long-Duration Energy Storage.
The rapid deployment of 4-hour lithium iron phosphate (LFP) battery systems has stabilized peak evening ramps (the infamous "duck curve") in California (CAISO), Texas (ERCOT), and South Australia. Between 2023 and 2026, installed utility battery capacity grew by 310% globally, with cell costs declining to $68/kWh at the pack level. However, 4-hour storage cannot resolve multi-day wind lulls or winter solar deficits (known as "Dunkelflaute"). To achieve 90%+ decarbonization, grids require Long-Duration Energy Storage (LDES) technologies operating across 12 to 100+ hour durations, including iron-air flow batteries, compressed air energy storage (CAES), and advanced pumped-storage hydropower.`
      },
      {
        pageNumber: 3,
        wordCount: 760,
        text: `Section 3: Grid Enhancing Technologies (GETs) and Dynamic Line Rating.
Building new high-voltage alternating current (HVAC) and direct current (HVDC) transmission lines faces an average lead time of 7 to 12 years due to environmental review and right-of-way permitting. As an immediate bridge, Grid Enhancing Technologies (GETs) can expand capacity by 20% to 40% on existing line corridors with capital expenditures under 5% of new build costs. Key GETs include:
1. Dynamic Line Rating (DLR): Uses real-time weather sensors (ambient temperature, wind speed, solar irradiance) to safely increase line transmission limits above static conservative ratings.
2. Advanced Power Flow Control (APFC): Modular FACTS devices that actively route power away from congested lines onto underutilized parallel lines.
3. High-Temperature Low-Sag (HTLS) Conductors: Re-conductoring existing transmission towers with composite core lines capable of carrying twice the current without exceeding thermal sag limits.`
      },
      {
        pageNumber: 4,
        wordCount: 730,
        text: `Section 4: Investment Requirements and Policy Recommendations.
Achieving net-zero electrical grids by 2035 requires global grid infrastructure investments to expand from $330 billion annually in 2025 to $680 billion annually by 2031. Key policy recommendations:
1. Streamlined Interconnection Procedures: Replace sequential "first-come, first-served" review queues with cluster-based study methodologies and milestone-based deposit readiness requirements.
2. Market Valuation of Inertia and Frequency Support: Modern inverters must provide synthetic inertia and grid-forming capabilities rather than purely grid-following behavior.
3. Regional Cost Allocation Frameworks: Establish transparent inter-state cost-sharing for multi-regional HVDC backbones that deliver low-cost wind and solar across balancing authorities.`
      }
    ],
    chunks: [
      {
        id: 'chunk-energy-1-0',
        pageNumber: 1,
        chunkIndex: 0,
        text: 'Executive Summary: Renewable energy accounted for 34% of global generation in 2025 and is projected to exceed 52% by 2032. Interconnection queues exceed 1,200 GW in North America and Europe, causing curtailment rates up to 8% without grid modernization.'
      },
      {
        id: 'chunk-energy-2-1',
        pageNumber: 2,
        chunkIndex: 1,
        text: 'Storage: 4-hour LFP battery capacity grew by 310% with costs falling to $68/kWh. However, resolving seasonal "Dunkelflaute" (wind and solar lulls) requires 12 to 100+ hour Long-Duration Energy Storage (LDES) such as iron-air and pumped hydro.'
      },
      {
        id: 'chunk-energy-3-2',
        pageNumber: 3,
        chunkIndex: 2,
        text: 'Grid Enhancing Technologies (GETs): Expanding capacity 20-40% on existing lines within 2 years using Dynamic Line Rating (DLR), Advanced Power Flow Control (APFC), and High-Temperature Low-Sag (HTLS) conductor reconductoring.'
      },
      {
        id: 'chunk-energy-4-3',
        pageNumber: 4,
        chunkIndex: 3,
        text: 'Policy and Investment: Requires scaling global grid spend from $330B to $680B annually by 2031. Recommendations include cluster interconnection studies, market payments for synthetic grid-forming inertia, and inter-state HVDC cost sharing.'
      }
    ]
  }
];
