import * as tf from '@tensorflow/tfjs';

export async function createModel(): Promise<tf.LayersModel> {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
  const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
  const ys = tf.tensor2d([-2, 0, 2, 4, 6, 8], [6, 1]);
  await model.fit(xs, ys, { epochs: 250 });
  return model;
}


