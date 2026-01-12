export interface IPayload<B = null, P = null> {
    body?: B;
    params?: P;
}