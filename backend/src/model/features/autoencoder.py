from tensorflow.keras.layers import Input, Dense
from tensorflow.keras.models import Model
from ...utils.custom_print import CustomPrint

printer = CustomPrint()

def construct_autoencoder(input_dim, encoding_dim):
    try:
        input_layer = Input(shape=(input_dim,))
        encoded = Dense(encoding_dim, activation='relu')(input_layer)
        decoded = Dense(input_dim, activation='sigmoid')(encoded)
        autoencoder = Model(inputs=input_layer, outputs=decoded)
        encoder = Model(inputs=input_layer, outputs=encoded)
        autoencoder.compile(optimizer='adam', loss='mse')
        return autoencoder, encoder
    except Exception as e:
        printer.error(f"Error constructing autoencoder: {e}")
        return None, None
